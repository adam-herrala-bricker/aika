import React from 'react';
import {useSelector} from 'react-redux';
import {howLongUntil} from '../../util/helpers';

// note: will upgrade this to display email, member since, number of streams/slices, data used, etc.
const UserInfo = () => {
  const {username, minutesUntilTokenExpires} = useSelector((i) => i.user);

  return (
    <div>
      <div>
        <b>Username:</b> {username}
      </div>
      <div>
        <b>Time until session expires:</b> {howLongUntil(minutesUntilTokenExpires)}
      </div>
    </div>
  );
};

export default UserInfo;
