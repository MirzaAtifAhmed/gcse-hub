import type { ProfileSettings } from '@gcse-hub/types';
import { type FormEvent, useEffect, useState } from 'react';
import { api } from '../lib/api';

const learningPreferenceOptions = [
  { value: 'worked-examples', label: 'Worked examples' },
  { value: 'diagrams', label: 'Diagrams' },
  { value: 'exam-questions', label: 'Exam questions' },
  { value: 'short-sessions', label: 'Short sessions' },
] as const;

interface ProfileSettingsPanelProps {
  onSaved?: () => void;
}

export function ProfileSettingsPanel({ onSaved }: ProfileSettingsPanelProps) {
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/profile/me')
      .then((res) => setProfile(res.data.data))
      .catch(() => setError('Could not load profile settings.'));
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    const form = new FormData(event.currentTarget);
    const learningPreferences = learningPreferenceOptions
      .map((option) => option.value)
      .filter((value) => form.getAll('learningPreferences').includes(value));

    try {
      const res = await api.patch('/profile/me', {
        firstName: String(form.get('firstName')),
        surname: String(form.get('surname')),
        currentYear: Number(form.get('currentYear')),
        target: String(form.get('target')),
        currentLevel: Number(form.get('currentLevel')),
        targetGrade: Number(form.get('targetGrade')),
        examBoard: String(form.get('examBoard')),
        studyGoalMinutesPerDay: Number(form.get('studyGoalMinutesPerDay')),
        learningPreferences,
      });

      setProfile(res.data.data.profile);
      setMessage('Profile updated. Your practice, tests and planner will use these settings.');
      onSaved?.();
    } catch {
      setError('Could not save profile. Please check the fields and try again.');
    }
  }

  if (!profile) {
    return (
      <section className="card section profile-settings-card">
        <h2>Learning profile</h2>
        <p>{error || 'Loading profile settings…'}</p>
      </section>
    );
  }

  return (
    <section className="card section profile-settings-card">
      <div className="section-title compact-title">
        <h2>Learning profile</h2>
        <p>Set the year, current level and target so GCSE Hub can personalise practice and tests.</p>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form className="profile-grid" onSubmit={saveProfile}>
        <div className="field">
          <label>First name</label>
          <input name="firstName" defaultValue={profile.firstName} required />
        </div>

        <div className="field">
          <label>Surname</label>
          <input name="surname" defaultValue={profile.surname} required />
        </div>

        <div className="field">
          <label>Current school year</label>
          <select name="currentYear" defaultValue={profile.currentYear ?? 8}>
            {[7, 8, 9, 10, 11].map((year) => (
              <option value={year} key={year}>Year {year}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Current working level</label>
          <select name="currentLevel" defaultValue={profile.currentLevel ?? profile.currentYear ?? 8}>
            {[7, 8, 9, 10, 11].map((year) => (
              <option value={year} key={year}>Year {year} level</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Target GCSE tier</label>
          <select name="target" defaultValue={profile.target ?? 'undecided'}>
            <option value="undecided">Undecided</option>
            <option value="foundation">Foundation</option>
            <option value="higher">Higher</option>
          </select>
        </div>

        <div className="field">
          <label>Target grade</label>
          <select name="targetGrade" defaultValue={profile.targetGrade ?? 5}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => (
              <option value={grade} key={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Exam board</label>
          <select name="examBoard" defaultValue={profile.examBoard ?? 'mixed'}>
            <option value="mixed">Mixed / not sure</option>
            <option value="aqa">AQA</option>
            <option value="edexcel">Edexcel</option>
            <option value="ocr">OCR</option>
          </select>
        </div>

        <div className="field">
          <label>Daily study goal</label>
          <select name="studyGoalMinutesPerDay" defaultValue={profile.studyGoalMinutesPerDay ?? 30}>
            <option value="15">15 minutes/day</option>
            <option value="30">30 minutes/day</option>
            <option value="45">45 minutes/day</option>
            <option value="60">60 minutes/day</option>
            <option value="90">90 minutes/day</option>
          </select>
        </div>

        <fieldset className="profile-preferences">
          <legend>Preferred learning support</legend>
          {learningPreferenceOptions.map((option) => (
            <label key={option.value}>
              <input
                type="checkbox"
                name="learningPreferences"
                value={option.value}
                defaultChecked={profile.learningPreferences?.includes(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="profile-actions">
          <button className="btn btn-primary" type="submit">Save profile</button>
        </div>
      </form>
    </section>
  );
}
