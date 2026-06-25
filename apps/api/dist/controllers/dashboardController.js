import { DEFAULT_SUBJECTS } from '@gcse-hub/shared';
import { User } from '../models/User.js';
import { toAuthUser } from '../utils/toAuthUser.js';
export async function getDashboard(req, res) {
    const user = await User.findById(req.user?.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
        success: true,
        data: {
            user: toAuthUser(user),
            subjects: DEFAULT_SUBJECTS.map((subject, index) => ({ id: String(index + 1), ...subject })),
            stats: {
                questionsAnswered: 0,
                accuracy: 0,
                totalStudyMinutes: 0,
                examsCompleted: 0,
            },
        },
    });
}
