from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length

class UpdateBioForm(FlaskForm):
    bio = StringField('bio', validators=[DataRequired(), Length(max=150)])
