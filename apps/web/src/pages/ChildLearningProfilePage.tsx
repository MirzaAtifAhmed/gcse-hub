import type { ProfileSettings } from '@gcse-hub/types';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { getApiErrorMessage } from '../utils/apiError';

const learningPreferenceOptions = [
  { value: 'worked-examples', label: 'Worked examples' },
  { value: 'diagrams', label: 'Diagrams' },
  { value: 'exam-questions', label: 'Exam questions' },
  { value: 'short-sessions', label: 'Short sessions' },
] as const;

export function ChildLearningProfilePage() {
  const { childId } = useParams();
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!childId) {
      setError('Missing child profile id.');
      return;
    }

    api
      .get(`/children/${childId}/profile`)
      .then((res) => setProfile(res.data.data))
      .catch((err) =>
        setError(
          getApiErrorMessage(err, {
            fallback: 'Could not load child learning profile.',
            offline: 'Cannot connect to GCSE Hub API. Please try again when the server is available.',
          }),
        ),
      );
  }, [childId]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!childId) {
      setError('Missing child profile id.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const learningPreferences = learningPreferenceOptions
      .map((option) => option.value)
      .filter((value) => form.getAll('learningPreferences').includes(value));

    try {
      const res = await api.patch(`/children/${childId}/profile`, {
        firstName: String(form.get('firstName')),
        surname: String(form.get('surname')),
        currentYear: Number(form.get('currentYear')),
        currentLevel: Number(form.get('currentLevel')),
        target: String(form.get('target')),
        targetGrade: Number(form.get('targetGrade')),
        examBoard: String(form.get('examBoard')),
        studyGoalMinutesPerDay: Number(form.get('studyGoalMinutesPerDay')),
        learningPreferences,
      });

      setProfile(res.data.data);
      setMessage('Child learning profile updated.');
    } catch (err) {
      setError(
        getApiErrorMessage(err, {
          fallback: 'Could not save child learning profile. Please check the fields and try again.',
          offline: 'Cannot connect to GCSE Hub API, so the profile was not saved. Please try again when the server is available.',
        }),
      );
    }
  }

  if (!profile) {
    return (
      <main className="page dashboard">
        <div className="container">
          <section className="card section">
            <h1>Child learning profile</h1>
            <p>{error || 'Loading child learning profile…'}</p>
            <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page dashboard">
      <div className="container">
        <section className="card section profile-settings-card">
          <div className="dashboard-header">
            <div>
              <h1>Child learning profile</h1>
              <p>
                Edit {profile.name}'s year, current level, target tier and learning preferences in one place.
              </p>
            </div>
            <Link className="btn btn-secondary" to="/dashboard">Back to dashboard</Link>
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
      </div>
    </main>
  );
}
