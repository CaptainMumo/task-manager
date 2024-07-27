"""
Tasks app models.
"""
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    """
    Task model class.

    Attributes:
        title (CharField): Title of the task.
        description (TextField): Description of the task.
        completed (BooleanField): Whether the task is completed or not.
        created_at (DateTimeField): Date and time when the task was created.
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
