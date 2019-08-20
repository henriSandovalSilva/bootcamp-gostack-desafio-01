const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let countRequests = 0;

server.use((req, res, next) => {
    countRequests++;
    console.log(`${countRequests} requests.`);

    return next();
});

function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find((p) => {
        return p.id == id;
    });


    if (!project) {
        return res.status(400).json({ error: 'Project not found.' });
    }

    return next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;

    const project = {
        id,
        title,
        tasks
    };

    projects.push(project);

    return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find((p) => {
        return p.id == id;
    });

    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.body;

    projects.splice(id, 1);

    return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find((p) => {
        return p.id == id;
    });

    project.tasks.push(title);

    return res.json(project);
});

server.listen(3000);
