# Kế Hoạch Giao Diện Chat Box Góc Phải

## Mục Tiêu

Tạo giao diện chat dạng chat box nổi ở góc phải màn hình cho Bookora. Chat không cần là một trang đầy đủ, mà là một widget nhỏ giúp người dùng nhắn tin nhanh với shop khi đang xem sản phẩm, giỏ hàng hoặc các trang mua sắm khác.

## Bối Cảnh Hiện Tại

- Frontend đã có route `fe/src/routes/chat.tsx` và page `fe/src/pages/chat.tsx`, nhưng hướng mới là chat box nổi thay vì trang chat toàn màn hình.
- API message hiện có trong `fe/src/api/message.ts`: `getConversations`, `getMessages`, `sendMessage`, `startConversation`.
- Socket hiện có trong `fe/src/lib/socket.ts`, dùng event `conversation:join`, `message:send`, `message:new`.
- Model dữ liệu hiện có `Conversation`, `ChatMessage`, `ChatUser` trong `fe/src/models/message.ts`.
- Ưu tiên dùng lại API/socket hiện có, không đổi backend nếu không cần.

## Phạm Vi Mong Muốn

- Thêm một chat widget nổi ở góc phải dưới màn hình.
- Widget có ba trạng thái: mở rộng, ẩn/thu gọn, và đóng hoàn toàn.
- Khi ẩn/thu gọn, hiển thị nút tròn hoặc pill nhỏ với icon chat và nhãn ngắn để mở lại.
- Khi đóng hoàn toàn, widget biến mất khỏi màn hình và không còn nút mở lại.
- Nếu có tin nhắn mới sau khi người dùng đã đóng, widget sẽ tự hiển thị lại đoạn chat để báo có tin nhắn.
- Khi mở rộng, hiển thị khung chat nhỏ gồm header, danh sách hội thoại hoặc tin nhắn, và ô nhập.
- Không cần thiết kế route `/chat` như màn hình chính trong phiên bản này, trừ khi vẫn muốn giữ làm fallback.

## Vị Trí Hiển Thị

- Chat box nằm `fixed` ở góc phải dưới màn hình.
- Desktop: cách mép phải và mép dưới khoảng `24px`.
- Mobile: cách mép khoảng `12px`, khung mở rộng gần full width nhưng vẫn chừa khoảng thở hai bên.
- Widget cần có `z-index` đủ cao để nổi trên nội dung, nhưng không che modal quan trọng nếu dự án có modal.

## Định Hướng Thiết Kế

- Register: product UI.
- Cảnh sử dụng: người mua đang duyệt sách và muốn hỏi shop nhanh mà không rời khỏi trang hiện tại.
- Theme: light, nền giấy ấm và trắng, chữ slate rõ ràng.
- Color strategy: restrained. Slate cho CTA và chữ chính, amber chỉ dùng cho điểm nhấn nhẹ như icon hoặc badge.
- Tránh cảm giác support chatbot generic. Widget nên giống kênh trao đổi với shop trong một hiệu sách hiện đại.
- Không dùng glassmorphism, gradient text, neon, hoặc card lồng card.

## Trạng Thái Ẩn / Thu Gọn

- Hiển thị nút chat nổi ở góc phải dưới.
- Nội dung gợi ý: `Tin nhắn` hoặc `Hỏi shop`.
- Có icon `MessageCircle`.
- Nếu có tin nhắn mới hoặc unread count về sau, có thể thêm badge nhỏ.
- Click vào nút sẽ mở chat box.
- Trạng thái này dùng cho hành động `Ẩn`, không phải `Đóng`.

## Trạng Thái Đóng Hoàn Toàn

- Khi người dùng bấm `Đóng`, toàn bộ chat widget biến mất khỏi màn hình.
- Không hiển thị nút nổi để mở lại sau khi đã đóng.
- Trạng thái đóng chỉ bị phá vỡ khi có tin nhắn mới từ socket.
- Khi có tin nhắn mới, widget tự xuất hiện lại ở trạng thái mở rộng hoặc thu gọn có badge, ưu tiên mở đúng hội thoại vừa nhận tin.
- Nếu không xác định được hội thoại, widget hiện lại ở danh sách hội thoại và làm nổi bật tin nhắn mới.
- Trạng thái đóng chỉ nên lưu trong local state của phiên hiện tại, không cần lưu vĩnh viễn vào localStorage trong phiên bản đầu.

## Trạng Thái Mở Rộng

- Khung chat desktop khoảng `360px` rộng và `520px` cao.
- Header hiển thị tiêu đề `Tin nhắn`, mô tả ngắn và nút đóng/thu gọn.
- Nếu chưa chọn hội thoại, hiển thị danh sách hội thoại gần đây.
- Nếu đã chọn hội thoại, hiển thị header đối tác, timeline tin nhắn và composer.
- Cần có nút quay lại danh sách hội thoại trong khung chat khi đang xem một hội thoại.

## Bố Cục Trong Chat Box

- Header: tiêu đề, trạng thái ngắn, nút đóng.
- Header cần có hai hành động riêng biệt: `Ẩn` và `Đóng`.
- `Ẩn` thu widget về nút nổi để người dùng có thể mở lại.
- `Đóng` làm widget biến mất hoàn toàn cho đến khi có tin nhắn mới.
- Conversation list: avatar/initial, tên shop hoặc người mua, tin nhắn cuối, thời gian.
- Active conversation: tên đối tác, nút quay lại, trạng thái `Đang trao đổi` hoặc `Hội thoại đã đóng` nếu có.
- Message timeline: scroll độc lập trong khung chat.
- Composer: input hoặc textarea ngắn, nút gửi rõ ràng.

## Bố Cục Mobile

- Khi mở, chat box nên rộng gần toàn màn hình: `calc(100vw - 24px)`.
- Chiều cao tối đa khoảng `min(620px, calc(100vh - 96px))`.
- Nút thu gọn vẫn dễ bấm.
- Nút `Ẩn` và `Đóng` phải đủ rõ để tránh người dùng bấm nhầm.
- Composer không bị che bởi cạnh dưới màn hình.
- Nếu bàn phím mobile làm thay đổi viewport, layout vẫn cần scroll được trong vùng tin nhắn.

## Trạng Thái Cần Thiết Kế

- Chưa đăng nhập: trong chat box hiển thị lời mời đăng nhập và CTA tới `/login`.
- Đang tải hội thoại: skeleton hoặc dòng chờ gọn.
- Không có hội thoại: empty state ngắn, hướng dẫn bắt đầu từ trang shop hoặc sản phẩm.
- Chưa chọn hội thoại: hiển thị danh sách hội thoại.
- Hội thoại chưa có tin nhắn: lời nhắc gửi câu chào đầu tiên.
- Đang gửi tin nhắn: disable input/nút gửi hoặc hiển thị pending state.
- Lỗi tải/gửi: banner nhỏ trong chat box.
- Hội thoại đóng: composer disabled, thông báo không thể gửi thêm.

## Tương Tác

- Click nút nổi để mở chat box sau khi widget đang ở trạng thái ẩn/thu gọn.
- Click `Ẩn` để thu gọn chat box và vẫn giữ nút nổi trên màn hình.
- Click `Đóng` để làm widget biến mất hoàn toàn khỏi màn hình.
- Click một hội thoại để vào màn hình tin nhắn.
- Click quay lại để trở về danh sách hội thoại.
- Auto-scroll xuống tin nhắn mới trong hội thoại đang mở.
- Tin nhắn mới từ socket cập nhật preview trong danh sách hội thoại.
- Nếu widget đang đóng hoàn toàn và có tin nhắn mới, widget tự hiển thị lại để người dùng thấy đoạn chat.
- Nếu widget đang ẩn/thu gọn và có tin nhắn mới, nút nổi hiển thị badge hoặc tự mở chat box tùy cách triển khai cuối cùng.
- Nếu socket không kết nối, fallback gửi qua HTTP hiện có.
- Không gửi tin nhắn rỗng hoặc chỉ có khoảng trắng.
- Enter để gửi tin nhắn; nếu dùng textarea, Shift+Enter xuống dòng.

## Nội Dung UI Gợi Ý

- Nút thu gọn: `Hỏi shop` hoặc `Tin nhắn`.
- Header widget: `Tin nhắn`.
- Mô tả header: `Trao đổi nhanh với shop.`
- Hành động header: `Ẩn` và `Đóng`.
- Empty list: `Bạn chưa có hội thoại nào.`
- Empty conversation: `Chưa có tin nhắn. Gửi lời chào để bắt đầu.`
- Placeholder composer: `Nhập tin nhắn...`.
- Login message: `Đăng nhập để nhắn tin với shop.`
- Login CTA: `Đăng nhập`.

## Chi Tiết Kỹ Thuật Dự Kiến

- Tạo component chat widget, ví dụ `fe/src/component/chatWidget.tsx`.
- Mount component ở layout chung, nhiều khả năng là `fe/src/component/siteLayout.tsx` hoặc root layout nếu muốn hiển thị toàn site.
- Có thể giữ `fe/src/pages/chat.tsx` hiện tại hoặc đơn giản hóa sau, nhưng ưu tiên không phá route đang có nếu chưa cần.
- Dùng `privateClient` API hiện có trong `fe/src/api/message.ts`.
- Dùng socket hiện có trong `fe/src/lib/socket.ts`.
- Dùng Tailwind class theo pattern hiện tại của dự án.
- Không thêm thư viện UI mới.
- Dùng local `useState` cho trạng thái `open`, `minimized`, `closed`.
- Không lưu trạng thái `closed` vào localStorage trong phiên bản đầu, để tránh người dùng mất chat lâu dài.
- Khi nhận `message:new`, nếu trạng thái hiện tại là `closed`, chuyển widget sang trạng thái hiển thị lại và chọn hội thoại tương ứng nếu có thể.

## Checklist Triển Khai

- Tạo component chat widget nổi.
- Thêm trạng thái mở rộng, ẩn/thu gọn, và đóng hoàn toàn.
- Khi bấm `Ẩn`, widget thu về nút nổi.
- Khi bấm `Đóng`, widget biến mất khỏi màn hình.
- Khi có tin nhắn mới trong trạng thái đóng, widget tự hiển thị lại đoạn chat.
- Hiển thị trạng thái chưa đăng nhập trong widget.
- Load và hiển thị danh sách hội thoại khi mở widget.
- Cho phép chọn hội thoại và load tin nhắn.
- Gửi tin nhắn qua socket hoặc fallback HTTP.
- Cập nhật preview hội thoại khi có tin nhắn mới.
- Thêm responsive cho desktop và mobile.
- Mount widget vào layout chung.
- Chạy `npm run build` trong `fe/` sau khi sửa.

## Câu Hỏi Cần Bạn Chỉnh Nếu Muốn

- Chat box hiển thị trên mọi trang hay chỉ trang shop/sản phẩm? chỉ hiển thị khi người dùng nhấn chat với shop
- Nút thu gọn nên ghi `Tin nhắn`, `Hỏi shop`, hay chỉ icon?
- Khi có tin nhắn mới sau khi đóng, widget nên tự mở rộng luôn hay chỉ hiện lại nút nổi kèm badge? mở lại
- Có cần tự mở chat box khi người dùng bấm `Nhắn tin shop` từ trang sản phẩm không?có
- Có cần unread badge trong phiên bản đầu không?
- Có muốn tắt chat box ở trang checkout để tránh che nút thanh toán không? có
