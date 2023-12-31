// jobController.js
const Job = require('../models/job.model');
const ApplyJob = require('../models/appliedjob.model');


exports.createJob = async (req, res) => {
    try {

        if (! req.body.title || ! req.body.type || ! req.body.company_id ) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const skills = req.body.skills ? req.body.skills : [];
        console.log(skills)
        const newJob = new Job({
            title: req.body.title,
            type: req.body.type,
            company_id: req.body.company_id,
            link: req.body.link,
            description: req.body.description,
            nature: req.body.nature,
            experience: req.body.experience,
            qualification: req.body.qualification,
            shift: req.body.shift,
            skills: skills

        });


        await newJob.save();

        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company_id');

        console.log('Populated jobs:', jobs);


        const formattedJobs = jobs.map(job => {
            console.log('Current job:', job);

            return {
                id: job._id,
                title: job.title,
                type: job.type,
                location: job.nature,
                qualification: job.qualification,
                experience: job.experience,
                postedOn: job.created,
                description: job.description,
                companyName: job.company_id ? job.company_id.name : null,
                company_id: job.company_id ? job.company_id._id : null,
                skills: job.skills,
                shift: job.shift,
            };
        });

        res.status(200).json({ status: true, message: 'Jobs fetched successfully', jobData: formattedJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


exports.applyJob = async (req, res) => {
    try {
        const { title, user_id, company_id } = req.body;

        // Check if the user has already applied
        const existingApplication = await ApplyJob.findOne({ user_id, company_id });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        // If not, create a new application
        const newApplyJob = new ApplyJob({
            position: title,
            user_id,
            company_id
        });

        await newApplyJob.save();

        res.status(201).json({ message: 'Applied for Job Successfully', job: newApplyJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllAppliedJobs = async (req, res) => {
    try {
        const company_id = req.params.id;
        console.log('Company ID:', company_id);
        const jobs = await ApplyJob.find({ company_id: company_id })
            .populate('user_id')
            .populate('company_id');

        console.log("jobs",jobs)

        const formattedJobs = jobs.map(job => {
            return {
                appliedDate: job.created,
                username: job.user_id ? job.user_id.name : null,
                position: job.position,
                companyName: job.company_id ? job.company_id.name : null,
            };
        });

        res.status(200).json({ status: true, message: 'Applied Jobs fetched successfully', jobData: formattedJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

exports.searchJobs = async (req, res) => {
    try {
        const { type, nature } = req.query;
        let query = {};

        if (type) {
            query.type = type;
        }
        if (nature) {
            query.nature = nature;
        }


        const jobs = await Job.find(query).populate('company_id');
        const formattedJobs = jobs.map(job => {
            return {
                id: job._id,
                title: job.title,
                type: job.type,
                location: job.nature,
                qualification: job.qualification,
                experience: job.experience,
                postedOn: job.created,
                description: job.description,
                companyName: job.company_id ? job.company_id.name : null,
                skills: job.skills,
                shift: job.shift,
            };
        });
        console.log(formattedJobs)

        res.status(200).json({ status: true, message: 'Search Result', searchData: formattedJobs });
    } catch (error) {
        res.status(500).send(error.message);
    }
};