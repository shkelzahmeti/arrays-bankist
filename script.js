'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// We have 1 OBJECT for each ACCOUNT.
// Why not use a `Map` insted of an `Object`.
// Because we're gonna pretend that all this data
// is coming from a WEB API, because data from API
// come as Objects. That's why we used Objects here.
// Then an Array, containing all these ACCOUNT OBJECTS.
// THIS IS ONE OF THE MOST COMMON WAYS OF ORGANIZING
// DATA IN JAVASCRIPT - SO, OBJECTS INSIDE ARRAY.

// Data
// (In the real world we would want much more data,
//  e.g. much more data for each of the `movements`,
//  not just the value, e.g. like `date of each movement`,
//  `maybe a description`, and so on. But this is just
//  a simple but great Project for training Arrays)

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

//-----------------------------------------------------------

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    //Use a variable because we will need `deposit` not only in the div,
    //but also in the className to change the color(red or green):
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
// Moved to `Login`

//-----------------------------------------------------------

// const calcDisplayBalance = function (movements) {
//   const balance = movements.reduce((acc, cur) => acc + cur, 0);
//   labelBalance.textContent = `${balance}€`;
// };

//Later of course these `movements` will be from
//the Account that's logged into the Application.
// calcDisplayBalance(account1.movements);
// Moved to `Login`

// Function above changed a bit, because we not only want
// to display it, but also save it to the Account. So, we
// will be able to read the `movements` from that Account
// and also create a new property `balance` on that Acc.

const calcDisplayBalance = function (acc) {
  // const balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  // acc.balance = balance;
  // We can do even better, store it directly:
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
  //We can set a new Property on the Account Object that we receive..
  //because all references point to the exact same Object in the Memory Heap.
};

//-----------------------------------------------------------

// const calcDisplaySummary = function (movements) {
//   //Just Filtering and Adding:
//   const incomes = movements
//     .filter(mov => mov > 0)
//     .reduce((add, mov) => add + mov, 0);
//   labelSumIn.textContent = `${incomes}€`;

//   const out = movements
//     .filter(mov => mov < 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = `${Math.abs(out)}€`;

//   const interest = movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * 1.2) / 100)
//     .filter((int, i, arr) => {
//       // console.log(arr);
//       return int >= 1;
//     })
//     .reduce((acc, int) => acc + int, 0);
//   labelSumInterest.textContent = `${interest}€`;
// };
// calcDisplaySummary(account1.movements);
// Moved to `Login`

//This was changed a bit, because we need to use the `interestRate` dynamically:

const calcDisplaySummary = function (acc) {
  //HERE
  //Just Filtering and Adding:
  const incomes = acc.movements //HERE
    .filter(mov => mov > 0)
    .reduce((add, mov) => add + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements //HERE
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements //HERE
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100) //HERE
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//-----------------------------------------------------------

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserNames(accounts);
// console.log(accounts);

//-----------------------------------------------------------

// This was added during `//----Transfers----`
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//----------------------Event Handlers-----------------------:

//--------Login--------:

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //As we click, in a flash you saw the 'Login' text in
  //Console then it disappeared. That's because this is
  //a <button> in the <form> Element, which it has the
  //default behaviour of reloading the page on click.
  //To prevent that we get access to the EVENT of the
  //CALLBACK FUNCTION, where we call a METHOD named
  //`preventDefault()`, which will PREVENT the FORM from SUBMITTING:
  e.preventDefault();
  console.log('Login');
  //To Log the User, we need to FIND the ACCOUNT from the
  //`accounts` Array with the USERNAME that the User inputted:

  // accounts.find(acc => acc.owner === inputLoginUsername.value);

  //Now let's save this into a Variable. The Variable needs to be
  //defined OUTSIDE of this function, because we will need the
  //information for this Account also in other functions later
  //(E.g. when we transfer money, we need to know
  //from which account that money should go)

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //If we enter a User that's not in our Data it will return undefined
  //(so from the `find` Method). Then in the `currentAccount.pin`
  //below we will get the Error:
  //`Uncaught TypeError: Cannot read properties of undefined (reading 'pin')`
  //To fix it we can check if the `currentAccount` exists first
  //`currentAccount && curr..`, but we can do better and use OPTIONAL
  //CHAINING `?.`. So the `pin` in `currentAccount.pin` below, will
  //will only be read if the `currentPin` exists..:
  //Now nothing happend, no Error, we only get `undefined` of
  //of course when the Account does not exist.
  console.log(currentAccount);
  //`currentAccount` is not a copy of the Object but it's reference
  //to the Memory Heap. So it's simply another Variable that
  // points to the Same/Original Object in the Memory Heap.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('hi');
    //When user Logs In:

    // 0. Clear Input Fields:
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    //Or we could do it in 1 go, because the
    //Assignment Operator `=` works from right to left:
    inputLoginUsername.value = inputLoginPin.value = '';
    //Lose focus on the `pin` input when Login(with Enter)
    inputLoginPin.blur();

    // 1. Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // It's good to use classes for this, but in this
    // case it's just one style.
    containerApp.style.opacity = '100';
    // 2. Display movements:
    displayMovements(currentAccount.movements);

    // 3. Display balance
    // calcDisplayBalance(currentAccount.movements);
    calcDisplayBalance(currentAccount);

    // 4. Display summary
    // calcDisplaySummary(currentAccount.movements);
    // We pass just the Account, because we changed the function a bit:
    calcDisplaySummary(currentAccount);
  }
});

//--------Transfers--------:

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //Because this also is a form
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  // 1. Implement Money Check:
  if (
    amount > 0 &&
    receiverAcc &&
    //Check `calcDisplayBalance`
    currentAccount.balance >= amount &&
    //Also not be able to transfer money to our own Acc.
    receiverAcc?.username !== currentAccount.userName
    //`?.` - if this Object doesn't exist, then immediately this here
    //`receiverAcc?.usename` will become `undefined` and the whole
    //AND Operation &&, will fail.
  ) {
    console.log('Transfer valid');
    // 2. Add a negative Movement to the Current User
    currentAccount.movements.push(-amount);
    // 3. And a positive Movement to the recipient:
    receiverAcc.movements.push(amount);
    // Now we could call `calcDisplayBalance` etc, but we know that
    // it's a BAD PRACTISE, so we'll create a function `updateUI`,
    // and call that function here, so REFACTORING OUR CODE:
    updateUI(currentAccount);
  }

  // 2. Add a negative Movement to the Current User
  // 3. And a positive Movement to the recipient:
});

//-------Loan Transfer-------

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  //The Loan is only granted if there's any deposit that's
  // = or > 10% of the requested amount of loan.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnLoan.addEventListener;

//-------Delete Account-------

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // console.log('Closed');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // 1. Delete Account

    // Splice it at a certain index `index`, which is the index we're
    // gonna calculate now, and we will remove exactly 1 Element
    accounts.splice(index, 1); //Mutates the Original Array, so no need to save the result to a Variable.
    console.log(accounts);

    // 2. Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//--------Sort---------
//State Variable which will monitor if we're currently
//sorting the array or not.
let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
//------------------------------------
