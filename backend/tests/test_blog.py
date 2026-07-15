async def _login(client, admin_user):
    response = await client.post(
        "/api/auth/login", json={"email": "admin@example.com", "password": "test-password"}
    )
    assert response.status_code == 200


async def test_draft_post_hidden_from_public_list(client, admin_user):
    await _login(client, admin_user)

    create = await client.post(
        "/api/admin/blog",
        json={"title": "Draft Post", "content_markdown": "wip"},
    )
    assert create.status_code == 201
    assert create.json()["published"] is False

    public_list = await client.get("/api/blog")
    assert public_list.json() == []

    admin_list = await client.get("/api/admin/blog")
    assert len(admin_list.json()) == 1


async def test_duplicate_titles_get_unique_slugs(client, admin_user):
    await _login(client, admin_user)

    first = await client.post(
        "/api/admin/blog", json={"title": "Same Title", "content_markdown": "a", "published": True}
    )
    second = await client.post(
        "/api/admin/blog", json={"title": "Same Title", "content_markdown": "b", "published": True}
    )

    assert first.json()["slug"] == "same-title"
    assert second.json()["slug"] == "same-title-2"


async def test_creating_post_requires_auth(client):
    response = await client.post(
        "/api/admin/blog", json={"title": "No Auth", "content_markdown": "x"}
    )
    assert response.status_code == 401
