const Test = require('../../models/moview/testModel');

exports.getAllTest = async (req, res) => {

    try {
        const tests = await Test.find({});
        res.status(200).json({ status: 'success', data: tests, error: null, msg: null });
    } catch (error) {
        res.status(500).json({ status: 'error', data: null, error: `error ${error}`, message: 'Server error: Cannot retrieve test.' });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching Test', error: err });
    }
};

exports.createTest = async (req, res) => {

    try {
        const newTest = new Test(req.body);
        const savedTest = await newTest.save();

        res.status(201).json({ status: 'success', data: savedTest, error: null, msg: null });
    } catch (err) {
        res.status(400).json({ message: 'Error creating test', error: err });
    }
};

exports.updateTestById = async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(test);
    } catch (err) {
        res.status(400).json({ message: 'Error updating test', error: err });
    }
};

exports.deleteTestById = async (req, res) => {
    try {
        const deletedTest = await Test.findByIdAndDelete(req.params.id);
        if (!deletedTest) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting test', error: err });
    }
};



exports.getTestTmdb = async (req, res) => {
    try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODE2MmRmNDgxZWQ1MWEzNjEzYTVjMmM0NTE4Y2VlMCIsIm5iZiI6MTcxOTU4MTYyNi42NjQsInN1YiI6IjY2N2ViYmJhYTU2OWE3ODVkMjY3ZTBhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oHVAf2Zk1fv0TIcU-mEgzzj6sUOzj8flnbNcmaEadgI';
        const API_KEY = '88162df481ed51a3613a5c2c4518cee0';
        // const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
        const url = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1';

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const response = await fetch(url, options);        
        console.log(response);
        const data = await response.json();
        res.status(200).json({ status: 'success', data: data.results });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

