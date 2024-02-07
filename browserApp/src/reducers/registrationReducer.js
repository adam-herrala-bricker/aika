// not strictly necessary but makes the code the <Register /> component cleaner
// this manages the state of the registration form
import {createSlice} from '@reduxjs/toolkit';

const defaultRegistration = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: ''
};

const registrationSlice = createSlice({
  name: 'registration',

  initialState: defaultRegistration,

  reducers: {
    clearRegistration() {
      return defaultRegistration;
    },

    clearPasswords(state) {
      return {
        ...state,
        password: defaultRegistration.password,
        passwordConfirm: defaultRegistration.passwordConfirm
      };
    },

    // pass this e.g. {email: user@example.com}
    updateRegistration(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const {clearPasswords, updateRegistration} = registrationSlice.actions;

export default registrationSlice.reducer;
