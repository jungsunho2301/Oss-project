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

// 초기 렌더링
renderPosts("all");