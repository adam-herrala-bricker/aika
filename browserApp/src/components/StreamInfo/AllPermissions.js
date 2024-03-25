import React from 'react';
import {useSelector} from 'react-redux';
import {useGetAllPermissionsQuery} from '../../services/streams';
import {Header} from 'semantic-ui-react';
import {permissionTypes} from '../../util/constants';

const AllPermissions = () => {
  const {loadedId} = useSelector((i) => i.stream);
  const {username} = useSelector((i) => i.user);
  const {data, isLoading} = useGetAllPermissionsQuery(loadedId);

  if (isLoading) return null;

  return (
    <div className = 'permissions-display-container'>
      <Header size = 'medium'>all users with stream permissions</Header>
      {data.map((permissions) =>
        <div key = {permissions.id} className = 'permissions-shared-container'>
          <Header size = 'tiny'>
            {permissions.user.username === username
              ? 'me'
              : permissions.user.username}
          </Header>
          <div className = 'permission-bubble-container'>
            {permissionTypes.map((type) =>
              <div
                className = {permissions[type] ? 'permission-bubble-yes' : 'permission-bubble-no'}
                key = {type}>
                {type}
              </div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPermissions;
