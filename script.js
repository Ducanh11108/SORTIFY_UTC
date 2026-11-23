// 1. Lấy các thành phần HTML cần sử dụng
const bars = document.getElementById("bars");
const algorithm = document.getElementById("algorithm");
const speed = document.getElementById("speed");
const speedText = document.getElementById("speedText");
const randomBtn = document.getElementById("randomBtn");
const startBtn = document.getElementById("startBtn");

let numbers = [];
let comparisons = 0;
let changes = 0;
let isRunning = false;

// 2. Tạo mảng gồm 12 số ngẫu nhiên
function createArray() {
    if (isRunning) return;

    numbers = [];
    for (let i = 0; i < 12; i++) {
        let number = Math.floor(Math.random() * 85) + 15;
        numbers.push(number);
    }

    comparisons = 0;
    changes = 0;
    document.getElementById("result").textContent = "Chưa chạy";
    document.getElementById("status").textContent = "Sẵn sàng";
    drawBars();
}

// 3. Hiển thị mảng bằng các cột
function drawBars(first = -1, second = -1, finished = false) {
    bars.innerHTML = "";

    for (let i = 0; i < numbers.length; i++) {
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = numbers[i] + "%";
        bar.textContent = numbers[i];

        if (finished) {
            bar.classList.add("done");
        } else if (i === first || i === second) {
            bar.classList.add("active");
        }

        bars.appendChild(bar);
    }

    document.getElementById("count").textContent = numbers.length;
    document.getElementById("comparisons").textContent = comparisons;
    document.getElementById("changes").textContent = changes;
}

// 4. Tạm dừng một chút để thấy từng bước
function wait() {
    let delay = 700 - Number(speed.value) * 120;
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

// 5. Đổi vị trí hai phần tử trong mảng
function swap(i, j) {
    let temp = numbers[i];
    numbers[i] = numbers[j];
    numbers[j] = temp;
    changes++;
}

// 6. Bubble Sort: so sánh hai phần tử liền kề
async function bubbleSort() {
    for (let i = 0; i < numbers.length - 1; i++) {
        for (let j = 0; j < numbers.length - i - 1; j++) {
            comparisons++;
            drawBars(j, j + 1);
            await wait();

            if (numbers[j] > numbers[j + 1]) {
                swap(j, j + 1);
                drawBars(j, j + 1);
                await wait();
            }
        }
    }
}

// 7. Selection Sort: tìm phần tử nhỏ nhất
async function selectionSort() {
    for (let i = 0; i < numbers.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < numbers.length; j++) {
            comparisons++;
            drawBars(minIndex, j);
            await wait();

            if (numbers[j] < numbers[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            swap(i, minIndex);
            drawBars(i, minIndex);
            await wait();
        }
    }
}

// 8. Insertion Sort: chèn phần tử vào đúng vị trí
async function insertionSort() {
    for (let i = 1; i < numbers.length; i++) {
        let current = numbers[i];
        let j = i - 1;

        while (j >= 0) {
            comparisons++;
            drawBars(j, j + 1);
            await wait();

            if (numbers[j] > current) {
                numbers[j + 1] = numbers[j];
                changes++;
                j--;
            } else {
                break;
            }
        }

        numbers[j + 1] = current;
        drawBars(j + 1, i);
        await wait();
    }
}

// 9. Chọn và chạy thuật toán
async function startSorting() {
    if (isRunning) return;

    // Khôi phục số liệu trước mỗi lần chạy để không cộng dồn.
    comparisons = 0;
    changes = 0;
    drawBars();

    isRunning = true;
    startBtn.disabled = true;
    randomBtn.disabled = true;
    algorithm.disabled = true;
    document.getElementById("status").textContent = "Đang sắp xếp...";
    document.getElementById("result").textContent = "Đang chạy";

    try {
        if (algorithm.value === "bubble") {
            await bubbleSort();
        } else if (algorithm.value === "selection") {
            await selectionSort();
        } else {
            await insertionSort();
        }

        drawBars(-1, -1, true);
        document.getElementById("status").textContent = "Hoàn thành";
        document.getElementById("result").textContent = "Đã xong";
    } finally {
        isRunning = false;
        startBtn.disabled = false;
        randomBtn.disabled = false;
        algorithm.disabled = false;
    }
}

// 10. Cập nhật kiến thức khi người dùng chọn thuật toán
function showAlgorithmInfo() {
    let title = document.getElementById("algorithmTitle");
    let explain = document.getElementById("algorithmExplain");
    let complexity = document.getElementById("algorithmComplexity");

    if (algorithm.value === "bubble") {
        title.textContent = "Bubble Sort hoạt động thế nào?";
        explain.textContent = "So sánh hai phần tử đứng cạnh nhau. Nếu số bên trái lớn hơn số bên phải thì đổi chỗ.";
        complexity.textContent = "Thời gian: O(n²) ở mọi trường hợp trong phiên bản này. Bộ nhớ phụ: O(1).";
    } else if (algorithm.value === "selection") {
        title.textContent = "Selection Sort hoạt động thế nào?";
        explain.textContent = "Tìm phần tử nhỏ nhất trong phần chưa sắp xếp rồi đổi chỗ với phần tử đầu phần đó.";
        complexity.textContent = "Thời gian: O(n²) ở mọi trường hợp. Bộ nhớ phụ: O(1).";
    } else {
        title.textContent = "Insertion Sort hoạt động thế nào?";
        explain.textContent = "Lấy từng phần tử và dịch các phần tử lớn hơn sang phải để chèn số đang xét vào đúng vị trí.";
        complexity.textContent = "Thời gian: tốt nhất O(n), trung bình và xấu nhất O(n²). Bộ nhớ phụ: O(1).";
    }
}

// 11. Gắn sự kiện cho các nút
randomBtn.addEventListener("click", createArray);
startBtn.addEventListener("click", startSorting);
algorithm.addEventListener("change", showAlgorithmInfo);
speed.addEventListener("input", function () {
    let labels = ["", "Rất chậm", "Chậm", "Trung bình", "Nhanh", "Rất nhanh"];
    speedText.textContent = labels[Number(speed.value)];
});

// Tạo dữ liệu khi mở trang lần đầu
createArray();
showAlgorithmInfo();
