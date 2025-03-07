from flask_wtf import FlaskForm
from wtforms import TextAreaField
from wtforms.validators import DataRequired, Length

class CreateCommentForm(FlaskForm):
    content = TextAreaField('content', validators=[DataRequired(), Length(min=1, max=500)])

