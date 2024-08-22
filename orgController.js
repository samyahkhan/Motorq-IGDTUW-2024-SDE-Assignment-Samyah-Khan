const Organization = require('./Organization');

// Create a new organization
const createOrg = async (req, res) => {
    try {
        const org = await Organization.create(req.body);
        res.status(201).json(org);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create organization' });
    }
};

// Update an existing organization
const updateOrg = async (req, res) => {
    try {
        const { id } = req.params;
        const org = await Organization.findByPk(id);

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        await org.update(req.body);
        res.json(org);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update organization' });
    }
};

// Get a single organization and its policies
const getOrg = async (req, res) => {
    try {
        const { id } = req.params;
        const org = await Organization.findByPk(id, {
            include: [{ model: Organization, as: 'Parent' }]
        });

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        const policies = {
            speedLimitPolicy: org.speedLimitPolicy || org.Parent.speedLimitPolicy,
            fuelReimbursementPolicy: org.fuelReimbursementPolicy || org.Parent.fuelReimbursementPolicy,
        };

        res.json({ ...org.toJSON(), policies });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch organization' });
    }
};

// Get all organizations
const getOrgs = async (req, res) => {
    try {
        const orgs = await Organization.findAll();
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch organizations' });
    }
};

module.exports = {
    createOrg,
    updateOrg,
    getOrg,
    getOrgs,
};
