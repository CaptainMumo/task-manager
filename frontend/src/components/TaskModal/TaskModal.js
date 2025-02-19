// src/components/TaskModal/TaskModal.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import CustomModal from '../Modal/CustomModal';
import { createTask, updateTask } from '../../api';
import './TaskModal.css';

const TaskModal = ({ show, onHide, onTaskCreatedOrUpdated, task, timeOut }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    if (!timeOut) timeOut = 2000;

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [task]);

    const handleSaveTask = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            let response;
            if (task) {
                response = await updateTask(task.id, title, description);
                setMessage('Task updated successfully');
            } else {
                response = await createTask(title, description);
                setMessage('Task created successfully');
            }
            setTimeout(() => {
                setMessage('');
            }, timeOut);
            onTaskCreatedOrUpdated(response);
        } catch (err) {
            setError(task ? 'Task update failed! Try again!' : 'Task creation failed! Try again!');
            setTimeout(() => {
                setError('');
            }, timeOut);
        } finally {
            if (!task) {
                setTitle('');
                setDescription('');
            }
            setLoading(false);
        }
    };

    const renderStatus = () => {
        if (loading) {
            return (
                <div className="status-overlay">
                    <div className="status-content">
                        <Spinner animation="border" variant="primary" size="lg" />
                        <div className="status-message">{task ? 'Updating...' : 'Creating...'}</div>
                    </div>
                </div>
            );
        } else if (message) {
            return (
                <div className="status-overlay">
                    <div className="status-content">
                        <MdCheckCircle size={48} color="green" />
                        <div className="status-message">{message}</div>
                    </div>
                </div>
            );
        } else if (error) {
            return (
                <div className="status-overlay">
                    <div className="status-content">
                        <MdCancel size={48} color="red" />
                        <div className="status-message">{error}</div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title={task ? "Update Task" : "Create New Task"}
            body={
                <div className="modal-body-container">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                isInvalid={title.length > 254}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="Task Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {renderStatus()}
                    </Form>
                </div>
            }
            footer={
                <>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveTask} disabled={loading}>
                        {loading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
                    </Button>
                </>
            }
        />
    );
};

export default TaskModal;
