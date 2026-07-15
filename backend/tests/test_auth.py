async def test_login_wrong_password_returns_401(client, admin_user):
    response = await client.post(
        "/api/auth/login", json={"email": "admin@example.com", "password": "wrong"}
    )
    assert response.status_code == 401


async def test_login_sets_cookie_and_me_works(client, admin_user):
    response = await client.post(
        "/api/auth/login", json={"email": "admin@example.com", "password": "test-password"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "admin@example.com"

    me = await client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["id"] == admin_user.id


async def test_me_without_cookie_returns_401(client):
    response = await client.get("/api/auth/me")
    assert response.status_code == 401
