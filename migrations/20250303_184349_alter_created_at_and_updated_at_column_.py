from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column

# revision identifiers, used by Alembic.
revision = 'e75627987545'
down_revision = '5157fa287807'
branch_labels = None
depends_on = None

def upgrade():
    # Create a temporary table with the desired column types
    op.create_table(
        'users_temp',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(40), nullable=False, unique=True),
        sa.Column('bio', sa.String(250), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=False), nullable=False),
        # Add other columns as needed
    )

    # Copy data from the original table to the temporary table
    users = table('users',
                  column('id', sa.Integer),
                  column('username', sa.String),
                  column('bio', sa.String),
                  column('hashed_password', sa.String),
                  column('created_at', sa.Integer),
                  column('updated_at', sa.Integer))

    op.execute(users.insert().from_select(['id', 'username', 'bio', 'hashed_password', 'created_at', 'updated_at'], sa.select([
        users.c.id,
        users.c.username,
        users.c.bio,
        users.c.hashed_password,
        sa.cast(users.c.created_at, sa.TIMESTAMP(timezone=False)),
        sa.cast(users.c.updated_at, sa.TIMESTAMP(timezone=False))
    ])))

    # Drop the original table
    op.drop_table('users')

    # Rename the temporary table to the original table name
    op.rename_table('users_temp', 'users')

def downgrade():
    # Recreate the original table with the old column types
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(40), nullable=False, unique=True),
        sa.Column('bio', sa.String(250), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.Integer, nullable=False),
        sa.Column('updated_at', sa.Integer, nullable=False),
        # Add other columns as needed
    )

    # Copy data from the modified table to the original table
    users_temp = table('users_temp',
                  column('id', sa.Integer),
                  column('username', sa.String),
                  column('bio', sa.String),
                  column('hashed_password', sa.String),
                  column('created_at', sa.TIMESTAMP(timezone=False)),
                  column('updated_at', sa.TIMESTAMP(timezone=False)))

    op.execute(users_temp.insert().from_select(['id', 'username', 'bio', 'hashed_password', 'created_at', 'updated_at'], sa.select([
        users_temp.c.id,
        users_temp.c.username,
        users_temp.c.bio,
        users_temp.c.hashed_password,
        sa.cast(users_temp.c.created_at, sa.Integer),
        sa.cast(users_temp.c.updated_at, sa.Integer)
    ])))

    # Drop the modified table
    op.drop_table('users_temp')

    # Rename the original table to the modified table name
    op.rename_table('users', 'users_temp')
