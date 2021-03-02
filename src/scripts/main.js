'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...tbody.rows];

let clicked = 0;
let pressedIndex = 0;

const convert = (string) => {
  return Number(string.replace(/[$,]/g, ''));
};

const sortColumn = (e) => {
  const index = e.target.cellIndex;
  let sorted;

  if (pressedIndex !== index) {
    clicked = 0;
  }

  pressedIndex = index;
  clicked++;

  if (Number.isNaN(convert(rows[0].cells[index].innerText))) {
    sorted = rows.sort(
      (currentRow, nextRow) => {
        const currentValue = currentRow.cells[index].innerText;
        const nextValue = nextRow.cells[index].innerText;

        return currentValue.localeCompare(nextValue);
      });
  } else {
    sorted = rows.sort((currentRow, nextRow) => {
      const currentValue = currentRow.cells[index].innerText;
      const nextValue = nextRow.cells[index].innerText;

      return convert(currentValue) - convert(nextValue);
    });
  }

  clicked % 2 !== 0
    ? tbody.append(...sorted)
    : tbody.append(...sorted.reverse());
};

thead.addEventListener('click', sortColumn);

const addClass = (e) => {
  const selected = e.currentTarget;

  rows.forEach(row => row.classList.remove('active'));
  selected.classList.add('active');
};

rows.forEach(row => row.addEventListener('click', addClass));

document.body.insertAdjacentHTML('beforeend', `
  <form class='new-employee-form'>
    <label>Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" type="text" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
       </select>
    </label>
    <label>Age:
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', addNewEmployee);

function createNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  const notificationTitle = document.createElement('h2');

  notificationTitle.className = 'title';
  notificationTitle.innerText = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.innerText = description;
  notification.append(notificationTitle, notificationDescription);

  document.body.prepend(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function addNewEmployee(e) {
  e.preventDefault();

  const data = new FormData(form);
  const employeeName = data.get('name');
  const age = data.get('age');
  const position = data.get('position');
  const salary = '$' + (Number(data.get('salary')).toLocaleString('en'));

  if (employeeName.length < 4) {
    return createNotification('error', 'Error',
      'Name should consist of 5 or more letters');
  }

  if (!position) {
    return createNotification('error', 'Error',
      'Please indicate the correct position');
  }

  if (age < 18 || age > 90) {
    return createNotification('error', 'Error',
      'Age should not be less than 18 or more than 90');
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${data.get('office')}</td>
      <td>${age}</td>
      <td>${salary}</td>
    </tr>
  `);

  form.elements.name.value = '';
  form.elements.age.value = '';
  form.elements.position.value = '';
  form.elements.salary.value = '';

  return createNotification('success', 'Success',
    'New employee was successfully added');
}
