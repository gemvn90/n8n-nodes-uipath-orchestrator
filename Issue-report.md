# Báo cáo Phân tích Mã nguồn n8n-nodes-uipath-orchestrator

**Mục tiêu:** Phân tích mã nguồn node n8n cho UiPath Orchestrator tại thư mục `nodes/UiPathOrchestrator` và đối chiếu với tài liệu API chính thức của UiPath để xác định nguyên nhân gây ra lỗi 400 (Bad Request) hoặc 404 (Not Found) trong môi trường On-prem.

**Tác giả:** Manus AI
**Ngày:** 24 tháng 11 năm 2025

---

## I. Tổng quan và Phương pháp Phân tích

Mã nguồn được phân tích là phiên bản tại `https://github.com/gemvn90/n8n-nodes-uipath-orchestrator/tree/main`. Chúng tôi tập trung vào các tệp thực thi API trong thư mục `operations` và hàm xử lý request chung trong `GenericFunctions.ts`.

Phương pháp phân tích bao gồm:
1.  **Phân tích Cấu trúc Request:** Kiểm tra các endpoint OData và REST API được sử dụng trong các tệp `assets.ts`, `processes.ts`, `robots.ts`, và `folders.ts`.
2.  **Đối chiếu Tài liệu API:** So sánh các endpoint này với tài liệu API chính thức của UiPath Orchestrator [1] để xác định sự khác biệt về đường dẫn (Entity Set) và cú pháp (Hàm OData tùy chỉnh).
3.  **Phân tích Kết nối On-prem:** Kiểm tra cách `GenericFunctions.ts` xây dựng Base URL và Token URL cho môi trường On-prem.

## II. Các Vấn đề Chính Gây Lỗi 400/404

Phân tích cho thấy nguyên nhân chính gây ra lỗi 400/404 trong môi trường On-prem là sự không đồng nhất giữa các Entity Set OData được sử dụng trong mã nguồn và các quy ước API hiện tại của UiPath, cùng với việc sử dụng các hàm OData tùy chỉnh không được đảm bảo tính ổn định.

### A. Lỗi Sử dụng Sai Entity Set (Processes)

Đây là nguyên nhân **rất có thể** gây ra lỗi 404 cho hầu hết các chức năng liên quan đến Processes. Trong UiPath Orchestrator, các hoạt động liên quan đến **Process** (Release) nên sử dụng Entity Set `/odata/Releases`, và các hoạt động liên quan đến **Package** nên sử dụng `/odata/Packages`. Tuy nhiên, tệp `processes.ts` lại sử dụng `/odata/Processes` cho hầu hết các hoạt động.

| Chức năng (Operation) | Endpoint trong Mã nguồn (`processes.ts`) | Endpoint Chính xác (Theo Tài liệu API) | Vấn đề Gây lỗi 404 |
| :--- | :--- | :--- | :--- |
| `getAll` | `/odata/Processes` | `/odata/Releases` | Sử dụng sai Entity Set. |
| `getArguments` | `/odata/Processes/UiPath...GetArguments` | `/odata/Releases/UiPath...GetArguments` | Sử dụng sai Entity Set. |
| `getProcessVersions` | `/odata/Processes/UiPath...GetProcessVersions` | `/odata/Releases/UiPath...GetProcessVersions` | Sử dụng sai Entity Set. |
| `downloadPackage` | `/odata/Processes/UiPath...DownloadPackage` | `/odata/Packages/UiPath...DownloadPackage` | Sử dụng sai Entity Set. |
| `uploadPackage` | `/odata/Processes/UiPath...UploadPackage` | `/odata/Packages/UiPath...UploadPackage` | Sử dụng sai Entity Set. |

### B. Lỗi Sử dụng API Cũ (Folders)

Một số chức năng trong `folders.ts` sử dụng tiền tố `/api/Folders` thay vì `/odata/Folders`. Các API sử dụng tiền tố `/api/` thường là các API cũ và có thể đã bị loại bỏ hoặc không được hỗ trợ trong các phiên bản Orchestrator mới hơn, đặc biệt là trong cấu hình On-prem.

| Chức năng (Operation) | Endpoint trong Mã nguồn (`folders.ts`) | Vấn đề Gây lỗi 404 tiềm ẩn |
| :--- | :--- | :--- |
| `delete` | `/api/Folders/DeleteByKey?key=${key}` | Sử dụng API cũ (`/api/`) thay vì OData (`/odata/`). |
| `getAll` | `/api/Folders/GetAllForCurrentUser` | Sử dụng API cũ (`/api/`) thay vì OData (`/odata/`). |
| `update` | `/api/Folders/PatchNameDescription` | Sử dụng API cũ (`/api/`) thay vì OData (`/odata/`). |

### C. Lỗi Hàm OData Tùy chỉnh (Assets, Robots, Folders)

Nhiều chức năng trong `assets.ts`, `robots.ts`, và `folders.ts` dựa vào các hàm OData tùy chỉnh (ví dụ: `UiPath.Server.Configuration.OData.GetFoldersForAsset`). Các hàm này không được đảm bảo tính ổn định và có thể đã bị thay đổi hoặc không tồn tại trong phiên bản Orchestrator On-prem mà người dùng đang sử dụng.

| Resource | Chức năng Bị ảnh hưởng (Ví dụ) | Vấn đề Gây lỗi 404/400 tiềm ẩn |
| :--- | :--- | :--- |
| **Assets** | `getFoldersForAsset`, `getRobotAssetByNameForRobotKey`, `shareToFolders` | Các hàm OData tùy chỉnh này không có trong tài liệu công khai và có thể đã bị thay đổi hoặc không tồn tại. |
| **Robots** | `getFolderRobots`, `getRobotsFromFolder`, `deleteBulk` | Các hàm OData tùy chỉnh có thể không tương thích với phiên bản On-prem. |
| **Folders** | `assignDomainUser`, `getMachinesForFolder`, `getUsersForFolder` | Các hàm OData tùy chỉnh có thể không tương thích với phiên bản On-prem. |

### D. Lỗi Cấu hình Kết nối On-prem (GenericFunctions.ts)

Hàm `uiPathApiRequest` trong `GenericFunctions.ts` xây dựng Base URL cho On-prem như sau:

```typescript
// Default on-prem path when full apiBaseUrl not provided
const defaultPath = '/DefaultTenant/orchestrator_';
baseUrl = serverUrl.replace(/\/$/, '') + defaultPath;
```

Việc thêm cứng `/DefaultTenant/orchestrator_` có thể không chính xác cho tất cả các cấu hình On-prem.
1.  **`/DefaultTenant`**: Nhiều cài đặt On-prem không sử dụng tiền tố tenant trong đường dẫn API.
2.  **`/orchestrator_`**: Dấu gạch dưới (`_`) thường là đặc trưng của môi trường Cloud. Môi trường On-prem thường là `/orchestrator` (không có dấu gạch dưới) hoặc không có tiền tố này.

Sự không chính xác trong việc xây dựng Base URL này là nguyên nhân hàng đầu gây ra lỗi 404 khi cố gắng kết nối với các endpoint API.

## III. Đề xuất Sửa lỗi Chi tiết

Để khắc phục các lỗi 400/404, chúng tôi đề xuất các thay đổi sau:

### 1. Sửa lỗi Entity Set trong `processes.ts`

Thay thế Entity Set `/odata/Processes` bằng Entity Set chính xác:

| Operation | Thay đổi Endpoint |
| :--- | :--- |
| `getAll`, `getArguments`, `getProcessVersions` | Thay `/odata/Processes` bằng **`/odata/Releases`** |
| `downloadPackage`, `uploadPackage` | Thay `/odata/Processes` bằng **`/odata/Packages`** |
| `deletePackage` | Cần xác định rõ người dùng muốn xóa Package hay Release. Nếu là Release, thay `/odata/Processes` bằng **`/odata/Releases`**. |

### 2. Sửa lỗi API Cũ trong `folders.ts`

Thay thế các endpoint `/api/Folders` bằng các endpoint OData tương ứng (cần tra cứu thêm tài liệu Swagger của phiên bản On-prem cụ thể để có endpoint OData chính xác cho các hoạt động này).

### 3. Cải thiện Cấu hình On-prem trong `GenericFunctions.ts`

Để tăng tính linh hoạt và tương thích với môi trường On-prem, nên thay đổi cách xây dựng Base URL:

*   **Đề xuất:** Cung cấp một trường cấu hình (trong Credentials) cho phép người dùng On-prem tự nhập **Base API URL đầy đủ** (ví dụ: `https://orchestrator.domain.com/odata/`) để ghi đè lên logic xây dựng URL mặc định.

*   **Sửa đổi logic mặc định (nếu không có Base API URL):**
    ```typescript
    // Thay thế logic hiện tại (dòng 152-153)
    // const defaultPath = '/DefaultTenant/orchestrator_';
    // baseUrl = serverUrl.replace(/\/$/, '') + defaultPath;

    // Bằng một logic linh hoạt hơn (ví dụ: chỉ sử dụng serverUrl và thêm /odata/ nếu cần)
    // Tuy nhiên, cách tốt nhất là cho phép người dùng tự cấu hình Base URL.
    ```

### 4. Kiểm tra và Thay thế Hàm OData Tùy chỉnh

Đối với các hàm OData tùy chỉnh (ví dụ: `GetFoldersForAsset`), cần thực hiện các bước sau:
1.  **Tra cứu Tài liệu Swagger On-prem:** Yêu cầu người dùng kiểm tra tài liệu Swagger của phiên bản Orchestrator On-prem cụ thể của họ để xác định endpoint chính xác.
2.  **Sử dụng API Thay thế:** Nếu hàm tùy chỉnh không hoạt động, hãy tìm kiếm các API chuẩn REST hoặc OData khác có chức năng tương đương.

---
## IV. Tài liệu Tham khảo

[1] UiPath Documentation. *Orchestrator API Guide*. Available at: https://docs.uipath.com/orchestrator/automation-cloud/latest/api-guide/read-me
