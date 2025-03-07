from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length

class UpdatePostForm(FlaskForm):
    content = StringField('content', validators=[
        DataRequired(),
        Length(max=500)  # Match the max length of the content field in the Post model
    ])
