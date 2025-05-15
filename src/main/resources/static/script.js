const categoryList = document.getElementById("category-list");
const postList = document.getElementById("post-list");
const categoryTitle = document.getElementById("category-title");
const postContent = document.getElementById("post-content");

// 게시글 렌더링 함수
async function renderPosts(category) {
    postList.innerHTML = "";
    postContent.innerHTML = "";
    categoryTitle.textContent = category === "all" ? "전체 게시판" : category + " 게시판";

    try {
        const url = category === "all" ? "/api/posts" : `/api/posts?category=${category}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("네트워크 오류");
        const posts = await response.json();

        posts.forEach(post => {
            const li = document.createElement("li");
            li.textContent = post.title;
            li.style.cursor = "pointer";

            li.addEventListener("click", () => {
                postContent.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                `;
            });

            postList.appendChild(li);
        });
    } catch (error) {
        postList.innerHTML = "<li>게시글을 불러오는 데 실패했습니다.</li>";
        postContent.innerHTML = "";
        console.error("게시글 로드 실패:", error);
    }
}

// 카테고리 클릭 이벤트 처리
categoryList.addEventListener("click", e => {
    if (e.target.tagName !== "LI") return;

    document.querySelectorAll("#category-list li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");

    const category = e.target.getAttribute("data-category");
    renderPosts(category);
});

document.getElementById("post-submit").addEventListener("click", async () => {
    if (!isLoggedIn) {
        alert("로그인 후에 작성할 수 있습니다.");
        return;
    }

    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content-input").value.trim();

    if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
    }

    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (!response.ok) throw new Error("게시글 작성 실패");

        alert("게시글이 작성되었습니다.");
        // 작성 폼 초기화
        document.getElementById("post-title").value = "";
        document.getElementById("post-content-input").value = "";

        // 게시글 목록 다시 불러오기 (예: 전체 카테고리)
        renderPosts("all");

    } catch (error) {
        alert("게시글 작성 중 오류가 발생했습니다.");
        console.error(error);
    }
});

// 초기 렌더링
renderPosts("all");