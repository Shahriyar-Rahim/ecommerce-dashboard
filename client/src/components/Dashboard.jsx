import { useEffect, useState } from "react";
import axios from "axios";
import { FiDollarSign, FiPackage, FiShoppingCart, FiUsers } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';


const Dashboard = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const StatCard = ({ title, value, icon: Icon, color }) => {
        return (
            <div className=" bg-white rounded-lg p-6 shadow-md">
                <div className=" flex items-center justify-between">

                    <div>
                        <p className=" text-gray-500 text-sm font-medium">{title}</p>
                        <p className=" text-2xl font-semibold mt-2">{value}</p>
                    </div>

                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className=" w-6 h-6 text-white" />
                    </div>

                </div>
            </div>
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKENDURL}api/dashboard/analytics`);
                // console.log(response.data)
                setData(response.data);

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, []);

    if (loading) return <div>Loading ...</div>;
    if (error) return div(`Error: ${error}`);
    if (!data) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US',
            {
                style: 'currency',
                currency: 'USD'
            }
        ).format(value);
    }

    return (
        <div className=" min-h-screen bg-gray-100 p-6">
            <div className=" max-w-7xl mx-auto">
                <h1 className=" text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {/* satats grid */}
                <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    <StatCard
                        title="Active Users"
                        value={data?.activeUsers}
                        icon={FiUsers}
                        color="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                    />

                    <StatCard
                        title="Total Products"
                        value={data?.totalProducts}
                        icon={FiPackage}
                        color="bg-green-500 hover:bg-green-600 transition-colors duration-300 ease-in-out"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(data?.totalRevenue)}
                        icon={FiDollarSign}
                        color="bg-purple-500 hover:bg-pueple-600 transition-colors duration-300 ease-in-out"
                    />
                    <StatCard
                        title="Conversion Rate"
                        value={data?.kpis?.conversionRate}
                        icon={FiShoppingCart}
                        color="bg-orange-500 hover:bg-oragne-600 transition-colors duration-300 ease-in-out"
                    />

                </div>

                {/* sales chart */}
                <div className=" bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
                    <div className=" flex justify-between items-center mb-6">
                        <div>
                            <h2 className=" text-2xl font-bold text-gray-800">Monthly Sales</h2>
                            <p className=" text-gray-500 mt-1">Revenue performance over time</p>
                        </div>

                        <div className=" flex items-center">
                            <div className=" w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                            <span className=" text-sm text-gray-600">Revenue</span>
                        </div>
                    </div>

                    {/* data chart */}
                    <div className=" h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                // set dataset here
                                data={data?.monthlySalesData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 20,
                                    bottom: 65,
                                }}
                            >

                                <defs>
                                    {/* <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient> */}
                                    <linearGradient id="reveneueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="month"
                                    // pas data here 
                                    tickFormatter={(month, index) => {
                                        const dataPoint = data.monthlySalesData[index];
                                        return `${new Date(0, month - 1).toLocaleString('default', { month: 'short' })} ${dataPoint.year}`
                                    }}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    tick={{
                                        fill: "#666",
                                        fontSize: 12
                                    }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatCurrency(value)}
                                    tick={{
                                        fill: "#666",
                                        fontSize: 12
                                    }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                    tickLine={{ stroke: "#f0f0f0" }}

                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        padding: '12px'
                                    }}
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                    labelFormatter={(_, payload) => {
                                        if (payload && payload[0]) {
                                            const dataPoint = payload[0].payload;
                                            return `${new Date(0, dataPoint.month - 1).toLocaleString('default', { month: 'short' })} ${dataPoint.year}`
                                        }
                                        return "";
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#fff",
                                        stroke: "#8884d8",
                                        strokeWidth: 2,
                                        r: 4
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: "#fff",
                                        stroke: "#8884d8",
                                        strokeWidth: 2,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#fff",
                                        stroke: "#8884d8",
                                        strokeWidth: 2,
                                        r: 4
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: "#fff",
                                        stroke: "#8884d8",
                                        strokeWidth: 2
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* add summary stats below the chart */}
                    <div className=" grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div>
                            <p className=" text-sm text-gray-500">Height Revenue</p>
                            <p className=" text-xl font-semibold mt-1">{formatCurrency(Math.max(...data.monthlySalesData.map(d => d.revenue)))}</p>
                        </div>

                        <div>
                            <p className=" text-sm text-gray-500">Average Revenue</p>
                            <p className=" text-xl font-semibold mt-1">{formatCurrency(
                                data?.monthlySalesData.reduce((acc, curr) => acc + curr.revenue, 0) / data.monthlySalesData.length
                            )}
                            </p>
                        </div>

                        <div>
                            <p className=" text-sm text-gray-500">Total Orders</p>
                            <p className=" text-xl font-semibold mt-1">{
                                data?.monthlySalesData.reduce((acc, curr) => acc + curr.orders, 0)
                            }
                            </p>
                        </div>
                    </div>

                    {/*  */}
                </div>

                {/* inventory and customers matrics */}
                <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className=" bg-white p-6 rounded-lg shadow-md">
                        <h2 className=" text-xl font-semibold mb-4">Inventory Matrics</h2>

                        <div className=" space-y-4">
                            <div>
                                <p className=" text-gray-500">Total Stock</p>
                                <p className=" text-2xl font-semibold">{data?.inventoryMatrics?.totalStock}</p>
                            </div>
                            <div>
                                <p className=" text-gray-500">Low Stock Items</p>
                                <p className=" text-2xl font-semibold text-orange-500">{data?.inventoryMatrics?.lowStock}</p>
                            </div>
                            <div>
                                <p className=" text-gray-500">Out of Stock</p>
                                <p className=" text-2xl font-semibold text-red-500">{data?.inventoryMatrics?.outOfStock}</p>
                            </div>
                        </div>
                    </div>


                    <div className=" bg-white p-6 rounded-lg shadow-md">
                        <h2 className=" text-xl font-semibold mb-4">Customer Analytics</h2>

                        <div className=" space-y-4">
                            <div>
                                <p className=" text-gray-500">Total Customers</p>
                                <p className=" text-2xl font-semibold">{data?.customerAnalytics?.totalCustomers}</p>
                            </div>
                            <div>
                                <p className=" text-gray-500">Average Lifetime Value</p>
                                <p className=" text-2xl font-semibold text-purple-500">
                                    {formatCurrency(data?.customerAnalytics?.averageLifeTimeValue)}
                                </p>
                            </div>
                            <div>
                                <p className=" text-gray-500">Average Orer Value</p>
                                <p className=" text-2xl font-semibold text-red-500">
                                     {formatCurrency(data?.kpis?.averageOrderValue)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard