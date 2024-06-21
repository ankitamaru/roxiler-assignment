const axios = require('axios');
const Transaction = require('../models/Transaction');

const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get(THIRD_PARTY_API_URL);
        const transactions = response.data;
        await Transaction.deleteMany(); // Clear existing data
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const query = {};

    if (month) {
        const monthIndex = new Date(Date.parse(month + " 1, 2020")).getMonth();
        query.dateOfSale = {
            $gte: new Date(2020, monthIndex, 1),
            $lt: new Date(2020, monthIndex + 1, 1)
        };
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
            { image: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStatistics = async (req, res) => {
    const { month } = req.query;
    const query = {};

    if (month) {
        const monthIndex = new Date(Date.parse(month + " 1, 2020")).getMonth();
        query.dateOfSale = {
            $gte: new Date(2020, monthIndex, 1),
            $lt: new Date(2020, monthIndex + 1, 1)
        };
    }

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
        const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBarChartData = async (req, res) => {
    const { month } = req.query;
    const query = {};

    if (month) {
        const monthIndex = new Date(Date.parse(month + " 1, 2020")).getMonth();
        query.dateOfSale = {
            $gte: new Date(2020, monthIndex, 1),
            $lt: new Date(2020, monthIndex + 1, 1)
        };
    }

    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];

    try {
        const results = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
            const count = await Transaction.countDocuments({
                ...query,
                price: { $gte: min, $lt: max }
            });
            return { range, count };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPieChartData = async (req, res) => {
    const { month } = req.query;
    const query = {};

    if (month) {
        const monthIndex = new Date(Date.parse(month + " 1, 2020")).getMonth();
        query.dateOfSale = {
            $gte: new Date(2020, monthIndex, 1),
            $lt: new Date(2020, monthIndex + 1, 1)
        };
    }

    try {
        const categories = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCombinedData = async (req, res) => {
    try {
        const [transactions, statistics, barChartData, pieChartData] = await Promise.all([
            listTransactions(req, res),
            getStatistics(req, res),
            getBarChartData(req, res),
            getPieChartData(req, res)
        ]);

        res.status(200).json({ transactions, statistics, barChartData, pieChartData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    initializeDatabase,
    listTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};
