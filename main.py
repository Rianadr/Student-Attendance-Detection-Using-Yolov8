from ultralytics import YOLO
import cv2
import zmq

# Load YOLOv8 model
model = YOLO('best_model2.pt', verbose=False)  # Ganti dengan path ke model YOLOv8 Anda

# Confidence threshold
CONFIDENCE_THRESHOLD = 0.35

# ZeroMQ setup
context = zmq.Context()
frame_socket = context.socket(zmq.PUB)
frame_socket.bind("tcp://*:5555")  # Port yang digunakan untuk mengirim data frame

# ZeroMQ setup for object count
count_socket = context.socket(zmq.PUB)
count_socket.bind("tcp://*:5556")  # Port untuk jumlah objek


# Fungsi untuk melakukan deteksi objek
def detect_objects(frame):
    results = model(frame)  # Melakukan deteksi objek
    detections = results[0].boxes  # Mengambil kotak bounding

    boxes = []
    for box in detections:
        conf = box.conf[0].item()  # Skor kepercayaan
        if conf < CONFIDENCE_THRESHOLD:
            continue

        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())  # Koordinat kotak
        boxes.append((x1, y1, x2, y2))

    return boxes

# Fungsi untuk melacak objek (menggunakan pergerakan antar frame)
def track_objects(prev_boxes, curr_boxes):
    # Inisialisasi list untuk melacak objek
    tracked_objects = []

    for prev_box in prev_boxes:
        best_match = None
        min_distance = float('inf')

        # Mencocokkan objek dengan bounding box di frame berikutnya berdasarkan jarak
        for curr_box in curr_boxes:
            distance = ((curr_box[0] - prev_box[0])**2 + (curr_box[1] - prev_box[1])**2)**0.5
            if distance < min_distance:
                min_distance = distance
                best_match = curr_box

        if best_match:
            tracked_objects.append(best_match)

    return tracked_objects

# Membuka stream video dari kamera atau video file
video_source = "rtsp://admin:rastek123@10.50.0.2/ISAPI/Streaming/channels/0601/picture"  # Ganti dengan path file video atau RTSP URL
cap = cv2.VideoCapture("IMG_4198.mov")

if not cap.isOpened():
    print("Error: Tidak dapat membuka sumber video.")
    exit()

frame_counter = 0
prev_boxes = []  # Menyimpan bounding box deteksi sebelumnya
tracked_boxes = []  # Menyimpan bounding box yang sedang dilacak

while True:
    ret, frame = cap.read()
    if not ret:
        print("Tidak dapat membaca frame dari video.")
        break

    frame_counter += 1

    # Deteksi objek hanya setiap 5 frame (misalnya untuk mengurangi beban)
    if frame_counter % 5 == 0:
        curr_boxes = detect_objects(frame)

        # Kirim jumlah objek yang terdeteksi
        object_count = len(curr_boxes)
        try:
            count_socket.send_string(str(object_count))
        except zmq.ZMQError as e:
            print(f"Error saat mengirim data counting: {e}")

        # Jika ada deteksi baru, reset pelacakan dan simpan bounding box
        if curr_boxes:
            prev_boxes = curr_boxes
            tracked_boxes = curr_boxes
        else:
            curr_boxes = prev_boxes

    else:
        # Melakukan pelacakan berdasarkan bounding box sebelumnya
        curr_boxes = prev_boxes  # Hanya update posisi objek berdasarkan pelacakan
        tracked_boxes = track_objects(prev_boxes, curr_boxes)

    # Gambarkan bounding box dan label pada frame
    for i, box in enumerate(tracked_boxes):
        x1, y1, x2, y2 = box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        label = f"Object {i+1}"
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Encode frame ke format JPEG
    _, buffer = cv2.imencode('.jpg', frame)

    try:
        frame_socket.send(buffer.tobytes())
    except zmq.ZMQError as e:
        print(f"Error saat mengirim data frame: {e}")

# Tutup semua jendela
cap.release()
# cv2.destroyAllWindows()