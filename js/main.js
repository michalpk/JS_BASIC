const formData = {
  username: "",
  password: "",
  retypePass: "",
  email: "",
  dob: "",
};

// Private constant that stores all users in user list
const _users = [];


// Definable rules for inputs - min (min length), max (max length), regex (regex test), mustBeEqual (input must be equal to another input)
const inputRules = {
  password: { min: 8, max: 64 },
  retypePass: { mustBeEqual: "password" },
  username: { min: 4, max: 64 },
  email: { regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
  dob: { regex: /^\d{4}-\d{2}-\d{2}$/ },
};

// Private constant that stores all input errors elements
const _inputErrors = {};

// Checking if user list contains any users, if not, we show a message
const userList = document.querySelector("#user-list");
if (_users.length === 0) {
  userList.innerHTML = "Empty";
}

// #region Event listeners
// All event listeners are defined here
const buttonEl = document.querySelector(".form > button");
buttonEl.addEventListener("click", (e) => {
  e.preventDefault();
  validateForm();
});

const inputs = document.querySelectorAll(".form > input");
inputs.forEach(input => {
  input.addEventListener("input", (e) => {
    onChange(e);
  });
});
// #endregion Event listeners

// Clearing form after adding user to the list
const clearForm = () => {
  Object.keys(formData).forEach(inputType => {
    formData[inputType] = "";
    const input = document.querySelector(`[data-form="${inputType}"]`);
    input.value = "";
  });
}

// Function that is called when input is changed
const onChange = (e) => {
  const value = e.target.value;
  const inputType = e.target.getAttribute("data-form");
  formData[inputType] = value;
  checkInputValues(inputType, value);
}

// When form is submitted we check if all inputs are valid
const validateForm = () => {
  Object.keys(formData).forEach(inputType => {
    checkInputValues(inputType, formData[inputType]);
  });
  if (Object.keys(_inputErrors).length === 0) {
    addUser();
  };
};

// Function that adds user to the list
const addUser = () => {
  const divEl = document.querySelector("#user-list");
  const spanEl = document.createElement("span");
  if (_users.length === 0)
    divEl.innerHTML = "";
  _users.push(formData);
  spanEl.innerHTML = `${formData.username} - ${formData.email} - ${formData.dob}`;
  divEl.appendChild(spanEl);
  clearForm();
};

// Here we check specific input and its value to defined rules
const checkInputValues = (inputType, value) => {
  const rules = inputRules[inputType];
  const input = document.querySelector(`[data-form="${inputType}"]`);
  if (rules) {
    if (rules.regex) {
      if (rules.regex.test(value)) {
        removeError(inputType)
      } else {
        createError(input, "Enter valid value!", inputType)
      }
    } else if (rules.min && rules.max) {
      if (value.length < rules.min || value.length > rules.max) {
        createError(input, "Enter value between " + rules.min + " and " + rules.max + " characters!", inputType)
      } else {
        removeError(inputType)
      }
    } else if (rules.mustBeEqual) {
      const valueToEqual = formData[rules.mustBeEqual];
      if (value !== valueToEqual) {
        createError(input, "Values are not equal!", inputType)
      } else {
        removeError(inputType)
      }
    }
  }
};

// Function that creates error message and adds it below the input
const createError = (domInput, error, inputType) => {
  if (_inputErrors[inputType])
    return;
  const errorEl = document.createElement("span");
  errorEl.classList.add("error");
  errorEl.innerHTML = error;
  domInput.parentNode.insertBefore(errorEl, domInput.nextSibling);;
  _inputErrors[inputType] = errorEl;
}


// Function that removes error message from below the input
const removeError = (inputType) => {
  const errorEl = _inputErrors[inputType];
  if (errorEl) {
    errorEl.remove();
    delete _inputErrors[inputType];
  }
}