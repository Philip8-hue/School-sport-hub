const homeText = (key, fallback) => window.homepageCopy?.[key] ?? fallback;
let communityItems = [];
const itemForm = document.getElementById("itemForm");
const itemTitle = document.getElementById("itemTitle");
const itemContent = document.getElementById("itemContent");
const itemMessage = document.getElementById("itemMessage");
const itemsList = document.getElementById("itemsList");

function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function renderItems(items) {
    communityItems = items;
    if (!items.length) {
        itemsList.innerHTML = '<p class="items-empty">'+escapeHtml(homeText('emptyCommunity','No posts yet. Be the first to share an update.'))+'</p>';
        return;
    }

    itemsList.innerHTML = items.map((item) => `
        <article class="item-card">
            <h3>${escapeHtml(item.title)}</h3>
            ${item.content ? `<p>${escapeHtml(item.content)}</p>` : ""}
            <time datetime="${escapeHtml(item.createdAt)}">${formatDate(item.createdAt)}</time>
        </article>
    `).join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadItems() {
    try {
        const response = await fetch("/api/items");
        if (!response.ok) throw new Error("Could not load posts");
        renderItems(await response.json());
    } catch (error) {
        itemsList.innerHTML = '<p class="items-error">'+escapeHtml(homeText('communityError','Posts are unavailable right now. Please try again later.'))+'</p>';
        console.error(error);
    }
}

itemForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = itemForm.querySelector("button[type=submit]");
    submit.disabled = true;
    itemMessage.textContent = homeText("publishingMessage", "Publishing…");

    try {
        const response = await fetch("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: itemTitle.value,
                content: itemContent.value
            })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || homeText("publishError", "Could not publish post"));

        itemForm.reset();
        itemMessage.textContent = homeText("publishedMessage", "Post published.");
        await loadItems();
    } catch (error) {
        itemMessage.textContent = error.message;
    } finally { submit.disabled = false; }
});

loadItems();

window.addEventListener("homepage-content-ready",()=>{if(itemsList)renderItems(communityItems);});
