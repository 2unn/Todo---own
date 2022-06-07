//Module
import alertMessage from "./noti.js";
import { getLocalStorage } from "./getLocalStorage.js";
import {
  getListApiVersion,
  createNewItemApi,
  updateItemApi,
  deleteItemApi,
} from "./fetchFunction.js";
import { Auth } from "./checkLogIn.js";

// Take ele
const input = document.getElementsByClassName("form-control")[0];
const errorMessage = document.getElementsByClassName("errorMessage")[0];

const deleteAllBtn = document.getElementsByClassName("btn btn-danger")[0];

const table = document.getElementsByClassName("tbody")[0];
const btnBack = document.querySelector(".btn.btn-secondary");

const localKeyId = "user";
const userId = getLocalStorage(localKeyId);

// Xử lí dữ liệu động
let isSearch = false;

Auth();
//----------------------------------------------------------------

let currentPage = 0;
console.log(currentPage);

function filterRender(list, currentPage) {
  const renderList = list.filter((val) => {
    if (val.user_id === userId) console.log(val.user_id);
    return val.user_id === userId;
  });
  render(renderList, currentPage);
}

function start() {
  getListApiVersion(filterRender);
  handleAdd();
  LogoutHandle();
}
start();
//Validate value

//In ra message lỗi
function errorMessageRender(isValidInput, isValidDuplicate) {
  if (!isValidInput) {
    errorMessage.innerText = "Vui lòng nhập!";
    console.log(input.classList);
    input.classList.add("border-danger");
    focus("");
  }
  if (!isValidDuplicate) {
    errorMessage.innerText = "Đã nhập nhiệm vụ này!";
    input.classList.add("border-danger");
    focus("");
  }
}

function validate(value) {
  let isValidInput = false;
  let isValidDuplicate = true;
  //Xử lí nhập khoảng trắng
  if (value.trim() !== "" && typeof value === "string") {
    isValidInput = true;
  }

  errorMessageRender(isValidInput, isValidDuplicate);
  return isValidInput && isValidDuplicate ? true : false;
}

//Hiện thị Render
function render(list, pageIndex = 0, pageSize = 4) {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const listfilter = list.slice(start, end);
  const htmls = listfilter
    .map((val, index) => {
      return ` <tr class = "list">
        <th scope="row">${pageIndex * pageSize + index}</th>
        <td class = 'value'>${val.name}</td>
        <td scope="row">
            <button type="button" id = 'edit' class="btn btn-info" onclick="Edit('${
              val.id
            }')">Edit</button>
            <button type="button" class="btn btn-warning btn-delete" onclick="Delete('${
              val.id
            }')">Delete</button>
        </td>
    </tr>
        `;
    })
    .join("");

  table.innerHTML = htmls;

  // Xử lí edit và delete

  errorMessage.innerText = "";
  itemEvent(list);
  listAction(list);
  input.classList.remove("border-danger");

  paginateList(list, pageIndex);
}

//Render pagination

function paginateList(list, pageIndex, pageSize = 4) {
  const pagination = document.getElementById("pagination");
  const paginationList = document.getElementsByClassName(
    "pagination justify-content-center"
  )[0];
  const countAray = [...Array(Math.ceil(list.length / pageSize))].map(
    (_, index) => +index
  );

  if (countAray.length > 1) {
    pagination.style.display = "block";
    const paginationListEL = countAray
      .map((_, index) => {
        return `<li id="${index}" class="page-item "><a class="page-link" >${
          index + 1
        }</a></li>`;
      })
      .join("");
    const htmls = `<li class="page-item previous">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      ${paginationListEL}
      <li class="page-item next">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
      `;
    paginationList.innerHTML = htmls;

    const btnPrevious =
      document.getElementsByClassName("page-item previous")[0];
    const btnNext = document.getElementsByClassName("page-item next")[0];
    if (pageIndex == 0) {
      btnPrevious.classList.add("disabled");
    } else {
      btnPrevious.classList.remove("disabled");
    }

    if (countAray.every((value) => pageIndex >= value)) {
      btnNext.classList.add("disabled");
    } else {
      btnNext.classList.remove("disabled");
    }

    //Xử lí render nút next và previous
    if (countAray.some((value) => pageIndex < value)) {
      btnNext.onclick = () => {
        currentPage = pageIndex + 1;
        filterRender(list, currentPage);
      };
    }
    if (countAray.some((value) => pageIndex > 0)) {
      btnPrevious.onclick = () => {
        currentPage = pageIndex - 1;
        filterRender(list, currentPage);
      };
    }

    //Xử lí các nút chuyển trang
    countAray.forEach((_, index) => {
      const pageBtn = document.getElementById(index);
      if (pageBtn.id == pageIndex) {
        pageBtn.classList.add("active");
      }
      pageBtn.onclick = (e) => {
        if (pageBtn.id == index) {
          pageBtn.classList.add("active");

          currentPage = index;
          const notActive = countAray.filter((val) => val !== index);
          notActive.forEach((val) => {
            const notActPageBtn = document.getElementById(val);
            notActPageBtn.classList.remove("active");
          });
        }
        filterRender(list, currentPage);
      };

      //Xử lí next và previous
    });
  } else {
    pagination.style.display = "none";
  }
}

//Function to do
function listAction(list) {
  deleteAllBtn.onclick = function deleteAll() {
    list = [];
    render(list);
  };

  const searchBtn = document.getElementsByClassName(
    "btn btn-warning btn-search"
  )[0];
  searchBtn.onclick = function () {
    let isSearch = true;
    console.log(list);
    const searchList = list.filter((value) => value.name.includes(input.value));
    // Xử lí nút back
    if (input.value.trim() !== "") {
      btnBack.style.display = "block";
      // paginateList(searchList);
      render(searchList);

      btnBack.onclick = () => {
        isSearch = false;
        getListApiVersion(filterRender);
        focus("");
        btnBack.style.display = "none";
      };
    } else {
      alertMessage("Bạn chưa nhập điều muốn tìm");
    }
  };

  const sortAToZBtn = document.getElementsByClassName(
    "btn btn-warning btn-sort"
  )[0];
  sortAToZBtn.onclick = function () {
    let isSort = false;
    if (!isSort) {
      function sortTodos(array) {
        isSort = true;
        array.sort((a, b) => a.name.localeCompare(b.name));
        return array;
      }

      sortTodos(list);
      render(list, currentPage);
    }
  };
}

//xỬ lí sự kiến của item
function itemEvent(listAction) {
  document.Edit = (idChange) => {
    focus("");
    const value = prompt("New todo : ");
    if (value !== null) {
      if (value !== "") {
        listAction.forEach((item) => {
          if (item.id === idChange) {
            item.name = value;
          }
          updateItemApi(
            () => {
              getListApiVersion((list) =>
                filterRender(listAction, currentPage)
              );
            },
            idChange,
            value
          );
        });
      } else {
        alertMessage("Vui lòng nhập");
      }
    } else {
      return;
    }
  };

  document.Delete = (id) => {
    focus("");
    const newList = listAction.filter((value) => {
      console.log(value);
      return value.id != id;
    });
    // btnBack.style.display = 'none';
    console.log(id);
    deleteItemApi(() => {
      getListApiVersion((list) => {
        if (list.length <= currentPage * 4) {
          const NewcurrentPage = currentPage - 1;

          filterRender(newList, NewcurrentPage);
        } else {
          filterRender(newList, currentPage);
        }
      });
    }, id);
  };
}

// Xử lí add
function handleAdd() {
  const addBtn = document.getElementsByClassName("btn btn-primary")[0];
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });
  addBtn.onclick = function () {
    const valid = validate(input.value);
    if (valid) {
      createNewItemApi(
        () => {
          getListApiVersion((list) => filterRender(list, currentPage));
        },
        input.value,
        userId
      );
      focus("");
    }
  };
}

function LogoutHandle() {
  const logOutBtn = document.getElementsByClassName("log-out")[0];
  logOutBtn.onclick = () => {
    window.location.href = ` https://2unn.github.io/Todo---own/validationtest/SignIn.html`;
    localStorage.removeItem(localKeyId);
  };
}

function focus(value) {
  input.value = value;
  input.focus();
}
