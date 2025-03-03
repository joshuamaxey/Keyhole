from flask_wtf import FlaskForm
from wtforms import TextAreaField, IntegerField
from wtforms.validators import DataRequired, Length, Optional

class CreatePostForm(FlaskForm):
    content = TextAreaField('content', validators=[DataRequired(), Length(max=500)])
    community_id = IntegerField('community_id', validators=[Optional()])
