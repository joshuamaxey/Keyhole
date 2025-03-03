from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Post, Comment, Community, CommunityMember, db
from datetime import datetime, timezone
from flask import jsonify

community_routes = Blueprint('communities', __name__)

@community_routes.errorhandler(404)
def not_found_error(error):
    return jsonify({"message": "Community not found"}), 404

@community_routes.route('', methods=['GET'])
def get_all_communities():
    """
    Retrieves a list of all communities.
    """
    communities = Community.query.all()
    return jsonify({"communities": [community.to_dict() for community in communities]}), 200


@community_routes.route('/<int:community_id>', methods=['GET'])
def get_community_by_id(community_id):
    """
    Retrieves details about a specific community.
    """
    community = Community.query.get_or_404(community_id)

    return jsonify(community.to_dict()), 200


@community_routes.route('/<int:community_id>/members', methods=['GET'])
@login_required
def get_community_members(community_id):
    """
    Retrieves a list of all members of a specific community.
    """
    community = Community.query.get_or_404(community_id)

    members = User.query.join(CommunityMember).filter(CommunityMember.community_id == community_id).all()
    return jsonify({"members": [member.to_dict() for member in members]}), 200



@community_routes.route('', methods=['POST'])
@login_required
def create_community():
    """
    Allows an authenticated user to create a new community.
    """
    data = request.get_json()

    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"message": "Bad Request", "errors": {"name": "Community name is required"}}), 400

    if not description:
        return jsonify({"message": "Bad Request", "errors": {"description": "Community description is required"}}), 400

    # Check for existing community with the same name
    existing_community = Community.query.filter_by(name=name).first()
    if existing_community:
        return jsonify({"message": "Bad Request", "errors": {"name": "Community name already exists"}}), 400

    community = Community(
        name=name,
        description=description,
        creator_id=current_user.id
    )

    db.session.add(community)
    db.session.commit()

    return jsonify(community.to_dict()), 201


@community_routes.route('/<int:community_id>', methods=['PUT'])
@login_required
def update_community(community_id):
    """
    Allows the creator of a community to update its details.
    """
    community = Community.query.get_or_404(community_id)

    if community.creator_id != current_user.id:
        return jsonify({"message": "You are not authorized to update this community"}), 403

    data = request.get_json()

    community.name = data.get('name', community.name)
    community.description = data.get('description', community.description)
    community.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify(community.to_dict()), 200


@community_routes.route('/<int:community_id>', methods=['DELETE'])
@login_required
def delete_community(community_id):
    """
    Allows the creator of a community to delete it.
    """
    community = Community.query.get_or_404(community_id)

    if community.creator_id != current_user.id:
        return jsonify({"message": "You are not authorized to delete this community"}), 403

    db.session.delete(community)
    db.session.commit()

    return '', 204


@community_routes.route('/<int:community_id>/join', methods=['POST'])
@login_required
def join_community(community_id):
    """
    Allows an authenticated user to join a community.
    """
    community = Community.query.get_or_404(community_id)

    # Check if user is already a member of the community
    membership = CommunityMember.query.filter_by(user_id=current_user.id, community_id=community_id).first()
    if membership:
        return jsonify({"message": "You are already a member of this community"}), 400

    # Add user to community
    membership = CommunityMember(user_id=current_user.id, community_id=community_id)
    db.session.add(membership)
    db.session.commit()

    return jsonify({"message": "Successfully joined the community"}), 200


@community_routes.route('/<int:community_id>/leave', methods=['DELETE'])
@login_required
def leave_community(community_id):
    """
    Allows an authenticated user to leave a community.
    """
    community = Community.query.get_or_404(community_id)

    # Check if user is a member of the community
    membership = CommunityMember.query.filter_by(user_id=current_user.id, community_id=community_id).first()
    if not membership:
        return jsonify({"message": "You are not a member of this community"}), 400

    # Remove user from community
    db.session.delete(membership)
    db.session.commit()

    return jsonify({"message": "Successfully left the community"}), 200

