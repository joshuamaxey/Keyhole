import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunitiesThunk, fetchCommunityMembersThunk } from "../../redux/community";
import CommunityCard from "./CommunityCard";
import { useNavigate } from "react-router-dom"; // Assuming React Router is used
import styles from "./Communities.module.css";

const Communities = ({onCommunitySelect}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to navigate to another route

  useEffect(() => {
    dispatch(fetchCommunitiesThunk());
  }, [dispatch]);

  const communitiesObject = useSelector((state) => state.communities);

  useEffect(() => {
    if (communitiesObject && Object.keys(communitiesObject).length > 0) {
      Object.values(communitiesObject).forEach((community) => {
        if (!community.members || community.members.length === 0) {
          dispatch(fetchCommunityMembersThunk(community.id));
        }
      });
    }
  }, [communitiesObject, dispatch]);

  const communities = communitiesObject ? Object.values(communitiesObject) : [];

  if (communities.length === 0) {
    return <div className={styles.loading}>Loading communities...</div>;
  }

  return (
    <div className={styles.container}>
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          name={community.name}
          description={community.description}
          members={community.members.length}
          onView={() => onCommunitySelect(community.id)}
        />
      ))}
    </div>
  );
};

export default Communities;
