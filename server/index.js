require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const NodeCache = require('node-cache');
const compression = require('compression')
const app = express();

const port = process.env.PORT;
const cache = new NodeCache({ stdTTL: 600 });

// middleware
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(cors({
//     origin: process.env.FRONTENDURL || 'http://localhost:5173' || 'https://ecommerce-dashboard-virid.vercel.app/api/dashboard/analytics' || 'https://ecommerce-dashboard-client-black.vercel.app',
//     accessControlAllowOrigin: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));


const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // create db and collection
        const db = await client.db('ecommerce-dashboard');

        // creating collections and indexes for faster query
        await db.collection("orders").createIndex({ orderDate: -1 })
        await db.collection("products").createIndex({ stock: 1 })
        await db.collection("products").createIndex({ category: 1 })
        await db.collection("users").createIndex({ lastLogin: -1 })
        await db.collection("users").createIndex({ email: 1 }, { unique: true })
        await db.collection("orders").createIndex({ userId: 1 })

        // dashboard analytics endpoint
        app.get("/api/dashboard/analytics", async (req, res) => {
            try {
                const cacheAnalytics = cache.get("dashboardAnalytics");
                if (cacheAnalytics) {
                    // console.log("Cache hit");
                    return res.json(cacheAnalytics);
                }

                const [activeUsers, totalProducts, totalRevenueData, monthlySalesData, inventoryMatrics, customerSegmentation] = await Promise.all([

                    // active users, and total products
                    db.collection("users").countDocuments(),
                    db.collection("products").countDocuments(),

                    // total revenue
                    db.collection("orders").aggregate([
                        {
                            $group:
                            {
                                _id: null,
                                totalRevenue: {
                                    $sum: "$totalAmount"
                                },
                                totalOrders: {
                                    $sum: 1
                                }
                            }
                        }
                    ]).toArray(),

                    // monthly sales data analysis
                    db.collection("orders").aggregate([
                        {
                            $group:
                            {
                                _id: {
                                    year: {
                                        $year: "$orderDate"
                                    },
                                    month: {
                                        $month: "$orderDate"
                                    }
                                },
                                revenue: {
                                    $sum: "$totalAmount"
                                },
                                orders: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project:
                            {
                                _id: 0,
                                year: "$_id.year",
                                month: "$_id.month",
                                revenue: 1,
                                orders: 1
                            }
                        },
                        {
                            $sort:
                            {
                                year: 1,
                                month: 1
                            }
                        }
                    ]).toArray(),

                    // inventory matrics
                    db.collection("products").aggregate([
                        {
                            $group:
                            {
                                _id: null,
                                totalStock: {
                                    $sum: "$stock"
                                },
                                averageStock: {
                                    $avg: "$stock"
                                },
                                lowStock: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $lt: ["$stock", 10]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                outOfStock: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: ["$stock", 0]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ]).toArray(),

                    // customer analytics / segmentation analysis
                    db.collection('orders').aggregate([
                        {
                            $group:
                            {
                                _id: "$userId",
                                totalSpend: {
                                    $sum: "$totalAmount"
                                },
                                orderCount: {
                                    $sum: 1
                                },
                                averageOrderValue: {
                                    $avg: "$totalAmount"
                                },
                                lasPurchaseDate: {
                                    $max: "$orderDate"
                                }
                            }
                        },
                        {
                            $addFields:
                            {
                                daysSinceLastPurchase: {
                                    $divide: [
                                        {
                                            $subtract: [
                                                new Date(),
                                                "$lasPurchaseDate"
                                            ]
                                        },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            }
                        },
                        {
                            $addFields:
                            {
                                segment: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: {
                                                    $and: [
                                                        {
                                                            $gte: ["$totalSpend", 1000]
                                                        },
                                                        {
                                                            $lt: [
                                                                "$daysSinceLastPurchase",
                                                                7
                                                            ]
                                                        }
                                                    ]
                                                },
                                                then: "VIP"
                                            },
                                            {
                                                case: {
                                                    $lt: [
                                                        "$daysSinceLastPurchase",
                                                        7
                                                    ]
                                                },
                                                then: "Active"
                                            },
                                            {
                                                case: {
                                                    $lt: [
                                                        "$daysSinceLastPurchase",
                                                        30
                                                    ]
                                                },
                                                then: "Regular"
                                            }
                                        ],
                                        default: "At risk"
                                    }
                                }
                            }
                        }
                    ]).toArray()

                ]);


                const totalOrders = totalRevenueData[0].totalOrders || 0;
                const totalRevenue = totalRevenueData[0].totalRevenue || 0;

                const analyticsData = {
                    activeUsers,
                    totalProducts,
                    totalRevenue,
                    monthlySalesData,
                    inventoryMatrics: inventoryMatrics[0],
                    customerAnalytics: {
                        totalCustomers: customerSegmentation.length,
                        averageLifeTimeValue: customerSegmentation.reduce((acc, curr) => acc + curr.totalSpend, 0) / customerSegmentation.length || 0,
                        customersSegment: customerSegmentation
                    },
                    kpis: {
                        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                        conversionRate: activeUsers > 0 ? ((totalOrders / activeUsers) * 100).toFixed(2) : "0.00",
                        stockTrurnoverRate: inventoryMatrics[0]?.totalStock > 0 ? totalRevenue / inventoryMatrics[0].totalStock : 0
                    }
                }

                cache.set("dashboardAnalytics", analyticsData, 600);

                res.json(analyticsData);

            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal server error",
                    error: error.message
                })
            }
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('E-commerce dashboard analytics api')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})