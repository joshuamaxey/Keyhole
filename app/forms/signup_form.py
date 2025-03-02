from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def password_exists(form, field):
    # Checking if password is provided
    password = field.data
    if not password:
        raise ValidationError('Password is required.')


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired(), password_exists])
    bio = StringField('bio', validators=[DataRequired(), Length(max=255)])
