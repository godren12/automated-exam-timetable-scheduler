INSERT INTO department (name, code) VALUES ('Computer Science', 'CS') ON CONFLICT DO NOTHING;
INSERT INTO department (name, code) VALUES ('Business', 'BUS') ON CONFLICT DO NOTHING;

INSERT INTO room (room_name, capacity) VALUES ('Hall A', 200) ON CONFLICT DO NOTHING;
INSERT INTO room (room_name, capacity) VALUES ('Hall B', 150) ON CONFLICT DO NOTHING;
INSERT INTO room (room_name, capacity) VALUES ('Lab 1', 50) ON CONFLICT DO NOTHING;

INSERT INTO lecturer (name, email) VALUES ('Dr. Kofi', 'kofi@uni.edu') ON CONFLICT DO NOTHING;
INSERT INTO lecturer (name, email) VALUES ('Prof. Ama', 'ama@uni.edu') ON CONFLICT DO NOTHING;