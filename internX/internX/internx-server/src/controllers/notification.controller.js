import { store } from '../data/store.js';

export const getNotifications = async (req, res) => {
  try {
    const studentEmail = req.query.studentEmail || req.user?.email;
    const studentId = req.query.studentId || req.userId;

    let list = store.notifications;
    if (studentEmail || studentId) {
      list = list.filter((n) =>
        (studentEmail && n.studentEmail?.toLowerCase() === studentEmail.toLowerCase()) ||
        (studentId && n.studentId === studentId)
      );
    }

    return res.json(list);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail || req.user?.email;
    const studentId = req.body.studentId || req.userId;

    store.notifications.forEach((n) => {
      if (!studentEmail && !studentId) {
        n.read = true;
      } else if (
        (studentEmail && n.studentEmail?.toLowerCase() === studentEmail.toLowerCase()) ||
        (studentId && n.studentId === studentId)
      ) {
        n.read = true;
      }
    });

    store.save();
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to mark notifications.' });
  }
};

export const markSingleRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      store.save();
    }
    return res.json({ success: true, notif });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};
