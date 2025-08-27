const $ = (sel) => document.querySelector(sel);
const fmt = (num) => `$ ${Number(num).toFixed(2)}`;

let state = {
  meta: {
    createdAt: new Date().toISOString().slice(0, 10),
    currency: "AUD",
  },
  expenses: [
    {
      id: "123",
      title: "Milk",
      category: "Groceries",
      amount: 5.5,
      date: "2025-07-23",
    },
    {
      id: "124",
      title: "Movie Ticket",
      category: "Entertainment",
      amount: 18,
      date: "2025-07-20",
    },
    {
      id: "125",
      title: "Bus Card Recharge",
      category: "Transport",
      amount: 30,
      date: "2025-07-18",
    },
    {
      id: "126",
      title: "Lunch with Friends",
      category: "Food",
      amount: 22.75,
      date: "2025-07-21",
    },
    {
      id: "127",
      title: "Phone Bill",
      category: "Utilities",
      amount: 60,
      date: "2025-07-10",
    },
  ], // {id,title,category,amount,date}
};

const sum = (...nums) => nums.reduce((acc, n) => acc + Number(n || 0), 0);

function render(list = state.expenses) {
  const ul = $("#items");
  ul.innerHTML = list
    .map(
      ({ id, title, category, amount, date }) => `
<li>
  <div>
    <div>
      <strong>${title}</strong>
      <span>${category}</span>
    </div>
    <div class="meta">${date || "-"}</div>
  </div>
  <div>
    <span>${fmt(amount)}</span>
    <button class="remove" data-id="${id}">Remove</button>
  </div>
</li>
    `
    )
    .join("");

  const total = sum(...state.expenses.map((items) => items.amount));
  $("#total").textContent = `Total: ${fmt(total)}`;
}

$("#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const el = e.currentTarget.elements;
  const { value: title } = el.itemTitle;
  const { value: category } = el.category;
  const { value: amountStr } = el.amount;
  const { value: date } = el.date;
  if (!title.trim()) return;
  const amount = Number(amountStr || 0);
  const id =
    crypto.randomUUID?.() ?? Date.now() + Math.random().toString(16).slice(2);

  const item = { id, title, category, amount, date };
  state = { ...state, expenses: [...state.expenses, item] };
  e.currentTarget.reset();
  render();
});

$("#items").addEventListener("click", (e) => {
  console.log(state);
  const btn = e.target.closest("button.remove");
  if (!btn) return;
  const id = btn.dataset.id;
  console.log("id", id);
  state = {
    ...state,
    expenses: state.expenses.filter((item) => item.id != id),
  };
  console.log(state);
  render();
  applyFilters();
});

$("#sort-amount").addEventListener("click", (e) => {
  state = {
    ...state,
    expenses: [...state.expenses].sort((a, b) => b.amount - a.amount),
  };
  render();
  applyFilters();
});

$("#sort-date").addEventListener("click", (e) => {
  state = {
    ...state,
    expenses: [...state.expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date) // ✅ 转成 Date 再比较
    ),
  };
  render();
  applyFilters();
});

$("#clear").addEventListener("click", (e) => {
  $("#search").value = "";
  $("#cat").value = "All";
  render();
});

const applyFilters = () => {
  const search = $("#search").value.trim().toLowerCase();
  const cat = $("#cat").value;
  const list = state.expenses.filter(({ title, category }) => {
    return (
      (search === "" || title.toLocaleLowerCase().includes(search)) &&
      (category === cat || cat === "All")
    );
  });
  console.log(list);
  render(list);
};

$("#search").addEventListener("input", (e) => applyFilters());
$("#cat").addEventListener("input", (e) => applyFilters());

$("#load").addEventListener("click", (e) => {
  // 默认值示例
  $("#itemTitle").value = "Coffee";
  $("#category").value = "Food";
  $("#amount").value = 4.5;
  $("#date").value = "2025-08-27"; // 需要 yyyy-mm-dd 格式
});

render();
// console.log(state);
