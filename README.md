# Bài test Backend NodeJS : Lê Trung Hậu

# Link deploy dự án :
```javascript     
http://testbackend.haudev.io.vn/swagger
```
- Backend : Nodejs(NestJS)
- Database : PostgreSQL
- Caching : localCache
- Security : accessToken, refreshToken, RateLimiter, BlackList
- Ops : Ec2, docker-compose, github actions

# Cấu trúc dự án
![Cấu trúc dư án](moTaDuAn/cauTrucDuAn.png)
- libs : 1 module dùng để khai báo các hàm, biến được chia sẻ với nhau trong source code
- src : nơi tập trung các module chính
- data : volumn của docker
- prisma : lưu file .prisma của ORM prisma
- .github : chứa file cấu hình github action

# Mô tả API :
## Login : /auth/login
- Thành công :  ![Login thành công](moTaDuAn/login_success.png)
- Sai Tên tài khoản : ![Login sai tên tài khoản](moTaDuAn/login_sai_tk.png)

- Sai mật khẩu : ![Login sai mật khẩu](moTaDuAn/login_sai_mk.png)

## register : /auth/register

- Thành công : ![Register thành công](moTaDuAn/register_success.png)
- Trùng Tên tài khoản : ![Register trùng tên tài khoản](moTaDuAn/register_trung_tk.png)


## refresh token : /auth/refresh_token truyền vào header 'x-refresh-token'
 - Thành công : ![refresh token](moTaDuAn/refresh_token_success.png)
 - Truyền sai : ![refresh token](moTaDuAn/refresh_token_fail.png)


## Change password : /auth/change_password
 - Thành công :![change password](moTaDuAn/change_password_success.png)
 - Sai mật khẩu gốc : ![change password](moTaDuAn/change_password_fail_old.png)
 - new Password và config password khác nhau : ![change password](moTaDuAn/change_password_confirm_fail.png)
 - Mật khẩu mới và mật khẩu cũ giống nhau : ![change password](moTaDuAn/change_password_old_and_new_password.png)

## Lấy danh sách user : /employees chỉ có quyền admin mới được xem danh sách user 
- Không có quyền : ![không có quyền](moTaDuAn/get_employee_forbidden.png)
- Lấy danh sách : [danh-sachs](moTaDuAn/get_employee.png)

## Lấy thông tin info của chính mình
- Thành công : ![thông tin](moTaDuAn/get_me.png)

## Update thông tin bản thân /patch : employee/me
- Thành công : ![thông tin](moTaDuAn/update_me.png)

## deactive tài khoản bản thân /delete : employee/me
- thành công : ![thông tin](moTaDuAn/deactivate_me.png)
- Không tìm thấy : khi deactive thì id của tài khoản vừa deactive sẽ được thêm vào blacklist với ttl bằng thời gian sống bằng token : ![thông tin](moTaDuAn/deactive_not_found.png)


## Cập nhật thông tin user khi có quyền ADMIN
-- không có quyền ![thông tin](moTaDuAn/forbidden_update_em.png)
-- không tìm thấy user  ![thông tin](moTaDuAn/notfound_update_em.png)
-- update thành công ![thông tin](moTaDuAn/success_update_em.png)