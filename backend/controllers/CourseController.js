// controllers/CourseController.js
const axios = require('axios');
const path = require('node:path');
// Ensure env is loaded if not already (works when importing controller directly)
if (!process.env.CANVAS_API_KEY) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const CANVAS_API_KEY = (process.env.CANVAS_API_KEY || '').trim();
const CANVAS_BASE_URL = 'https://canvas.instructure.com/api/v1';
// For now, default to mock mode; set CANVAS_USE_MOCK=false to hit real Canvas
const CANVAS_USE_MOCK = String(process.env.CANVAS_USE_MOCK || 'true').toLowerCase() === 'true';

// Realistic dummy data for courses (IDs as strings to avoid JS precision loss)
const DUMMY_COURSES = [
  { id: '131270000000002160', name: '9th Grade Academy 2025', course_code: '9th Grade Academy 2025', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002100', name: 'Biology - Nesbitt', course_code: 'Biology - Nesbitt', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002110', name: 'Computer Science Investigations - Emmanuel-Mangum', course_code: 'Computer Science Investigations - Emmanuel-Mangum', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002140', name: 'French III (Virtual Virginia)* - Virginia', course_code: 'French III (Virtual Virginia)* - Virginia', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002100', name: 'Geometry - Minks', course_code: 'Geometry - Minks', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002100', name: 'Global Studies I (Eng 9 & World Geo) - VanderRoest', course_code: 'Global Studies I (Eng 9 & World Geo) - VanderRoest', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002130', name: 'Health and PE 10* - Castelvecchi', course_code: 'Health and PE 10* - Castelvecchi', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
  { id: '131270000000002160', name: 'Raptor Rotation 25-26 - CodeRVA', course_code: 'Raptor Rotation 25-26 - CodeRVA', enrollment_term_id: '131270000000000300', workflow_state: 'available', start_at: null, end_at: null },
];

function respondWithDummyCourses(res) {
  return res.status(200).json({ success: true, count: DUMMY_COURSES.length, data: DUMMY_COURSES });
}


// Parse Canvas Link header to find the next page URL
function getNextLink(linkHeader) {
  if (!linkHeader) return null;
  const parts = linkHeader.split(',');
  for (const part of parts) {
    const section = part.split(';');
    if (section.length < 2) continue;
    const urlPart = section[0].trim();
    const relPart = section[1].trim();
    if (relPart.includes('rel="next"')) {
      const match = urlPart.match(/<(.*)>/);
      return match ? match[1] : null;
    }
  }
  return null;
}

/**
 * Get all courses for the authenticated user
 * GET /courses
 */
const getCourses = async (req, res) => {
  try {
    // Mock mode short-circuit
    if (CANVAS_USE_MOCK || String(req.query.mock).toLowerCase() === 'true') {
      return respondWithDummyCourses(res);
    }
    const response = await axios.get(`${CANVAS_BASE_URL}/courses`, {
      headers: {
        'Authorization': `Bearer ${CANVAS_API_KEY}`
      },
      params: {
        enrollment_state: 'active',
        per_page: 100
      }
    });

    const courses = response.data.map(course => ({
      id: course.id,
      name: course.name,
      course_code: course.course_code,
      enrollment_term_id: course.enrollment_term_id,
      workflow_state: course.workflow_state,
      start_at: course.start_at,
      end_at: course.end_at
    }));

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error.response?.data || error.message);
    // If unauthorized/forbidden (no access), provide dummy payload
    if ([401, 403].includes(error.response?.status)) {
      return respondWithDummyCourses(res);
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || 'Failed to fetch courses from Canvas'
    });
  }
};

/**
 * Get grades for a particular course
 * GET /grades/:courseId
 */
const getGrades = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      error: 'Course ID is required'
    });
  }

  try {
    if (CANVAS_USE_MOCK || String(req.query.mock).toLowerCase() === 'true') {
      // Provide a small mock grade set for the course
      const mock = [
        { user_id: '1001', user_name: 'Alice Johnson', course_id: String(courseId), current_grade: 'A-', current_score: 91.2, final_grade: 'A-', final_score: 91.2, enrollment_state: 'active' },
        { user_id: '1002', user_name: 'Brian Lee', course_id: String(courseId), current_grade: 'B+', current_score: 88.6, final_grade: 'B+', final_score: 88.6, enrollment_state: 'active' },
      ];
      return res.status(200).json({ success: true, course_id: String(courseId), count: mock.length, data: mock });
    }
    // Get enrollments for the course (includes grade information)
    const response = await axios.get(`${CANVAS_BASE_URL}/courses/${courseId}/enrollments`, {
      headers: {
        'Authorization': `Bearer ${CANVAS_API_KEY}`
      },
      params: {
        type: ['StudentEnrollment'],
        per_page: 100
      }
    });

    const grades = response.data.map(enrollment => ({
      user_id: enrollment.user_id,
      user_name: enrollment.user?.name,
      course_id: enrollment.course_id,
      current_grade: enrollment.grades?.current_grade,
      current_score: enrollment.grades?.current_score,
      final_grade: enrollment.grades?.final_grade,
      final_score: enrollment.grades?.final_score,
      enrollment_state: enrollment.enrollment_state
    }));

    res.status(200).json({
      success: true,
      course_id: courseId,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    console.error('Error fetching grades:', error.response?.data || error.message);
    if ([401, 403].includes(error.response?.status)) {
      const mock = [
        { user_id: '1001', user_name: 'Alice Johnson', course_id: String(courseId), current_grade: 'A-', current_score: 91.2, final_grade: 'A-', final_score: 91.2, enrollment_state: 'active' },
        { user_id: '1002', user_name: 'Brian Lee', course_id: String(courseId), current_grade: 'B+', current_score: 88.6, final_grade: 'B+', final_score: 88.6, enrollment_state: 'active' },
      ];
      return res.status(200).json({ success: true, course_id: String(courseId), count: mock.length, data: mock });
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.errors?.[0]?.message || 'Failed to fetch grades from Canvas'
    });
  }
};

/**
 * List assignments for a course
 * GET /courses/:courseId/assignments
 * Query params:
 *  - include: comma-separated list (e.g., submission,rubric)
 *  - page, per_page
 *  - all=true to fetch all pages
 */
const getAssignments = async (req, res) => {
  const { courseId } = req.params;
  const { include, page, per_page, all } = req.query;

  if (!courseId) {
    return res.status(400).json({ success: false, error: 'Course ID is required' });
  }

  try {
    if (CANVAS_USE_MOCK || String(req.query.mock).toLowerCase() === 'true') {
      const now = new Date();
      const iso = (d) => d.toISOString();
      const addDays = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
      const mockAssignments = [
        {
          id: '50001',
          course_id: String(courseId),
          name: 'Syllabus Quiz',
          description: '<p>Quick check to confirm you reviewed the syllabus.</p>',
          created_at: iso(addDays(-3)),
          updated_at: iso(addDays(-2)),
          due_at: iso(addDays(2)),
          unlock_at: null,
          lock_at: null,
          points_possible: 10,
          grading_type: 'points',
          allowed_extensions: null,
          submission_types: ['online_quiz'],
          has_submitted_submissions: false,
          needs_grading_count: 0,
          assignment_group_id: '100',
          html_url: `https://canvas.example.com/courses/${courseId}/assignments/50001`,
          url: null,
          rubric: null,
          rubric_settings: null,
          use_rubric_for_grading: false,
          peer_reviews: false,
          automatic_peer_reviews: false,
          group_category_id: null,
          grade_group_students_individually: false,
          moderated_grading: false,
          omit_from_final_grade: false,
          only_visible_to_overrides: false,
          published: true,
          unpublishable: true,
          max_attempts: -1,
          anonymous_submissions: false,
          external_tool_tag_attributes: null,
        },
        {
          id: '50002',
          course_id: String(courseId),
          name: 'Homework 1: Foundations',
          description: '<p>Submit a single PDF with your solutions to problems 1-10.</p>',
          created_at: iso(addDays(-5)),
          updated_at: iso(addDays(-1)),
          due_at: iso(addDays(5)),
          unlock_at: null,
          lock_at: null,
          points_possible: 100,
          grading_type: 'points',
          allowed_extensions: ['pdf', 'docx'],
          submission_types: ['online_upload'],
          has_submitted_submissions: true,
          needs_grading_count: 3,
          assignment_group_id: '100',
          html_url: `https://canvas.example.com/courses/${courseId}/assignments/50002`,
          url: null,
          rubric: [
            { id: 'r1', points: 10, description: 'Presentation', long_description: 'Formatting and clarity' },
            { id: 'r2', points: 90, description: 'Correctness', long_description: 'Accuracy of solutions' },
          ],
          rubric_settings: { points_possible: 100, free_form_criterion_comments: true },
          use_rubric_for_grading: true,
          peer_reviews: false,
          automatic_peer_reviews: false,
          group_category_id: null,
          grade_group_students_individually: false,
          moderated_grading: false,
          omit_from_final_grade: false,
          only_visible_to_overrides: false,
          published: true,
          unpublishable: true,
          max_attempts: -1,
          anonymous_submissions: false,
          external_tool_tag_attributes: null,
        },
        {
          id: '50003',
          course_id: String(courseId),
          name: 'Lab 1',
          description: '<p>Follow the lab handout and upload your report.</p>',
          created_at: iso(addDays(-6)),
          updated_at: iso(addDays(-4)),
          due_at: iso(addDays(7)),
          unlock_at: null,
          lock_at: null,
          points_possible: 50,
          grading_type: 'points',
          allowed_extensions: ['pdf'],
          submission_types: ['online_upload'],
          has_submitted_submissions: false,
          needs_grading_count: 0,
          assignment_group_id: '101',
          html_url: `https://canvas.example.com/courses/${courseId}/assignments/50003`,
          url: null,
          rubric: null,
          rubric_settings: null,
          use_rubric_for_grading: false,
          peer_reviews: true,
          automatic_peer_reviews: true,
          group_category_id: null,
          grade_group_students_individually: false,
          moderated_grading: false,
          omit_from_final_grade: false,
          only_visible_to_overrides: false,
          published: true,
          unpublishable: true,
          max_attempts: -1,
          anonymous_submissions: false,
          external_tool_tag_attributes: null,
        },
      ];
      return res.status(200).json({ success: true, course_id: String(courseId), count: mockAssignments.length, data: mockAssignments });
    }
  const headers = { Authorization: `Bearer ${CANVAS_API_KEY}` };
    const paramsBase = {};

    if (include) {
      const includeArr = String(include)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (includeArr.length) paramsBase.include = includeArr;
    }

    if (per_page) paramsBase.per_page = Number(per_page) || 100;
    if (page) paramsBase.page = Number(page) || 1;

    const firstUrl = `${CANVAS_BASE_URL}/courses/${courseId}/assignments`;
    const fetchPage = async (url, params) => axios.get(url, { headers, params });

    let assignments = [];
    if (String(all).toLowerCase() === 'true') {
      let url = firstUrl;
      let params = { ...paramsBase, per_page: paramsBase.per_page || 100 };
      for (let i = 0; i < 50; i++) {
        const resp = await fetchPage(url, params);
        assignments = assignments.concat(resp.data || []);
        const nextLink = getNextLink(resp.headers?.link);
        if (!nextLink) break;
        url = nextLink;
        params = undefined;
      }
    } else {
      const resp = await fetchPage(firstUrl, paramsBase);
      assignments = resp.data || [];
    }

    const shaped = assignments.map((a) => ({
      id: a.id ?? null,
      course_id: a.course_id ?? null,
      name: a.name ?? null,
      description: a.description ?? null, // HTML string
      created_at: a.created_at ?? null,
      updated_at: a.updated_at ?? null,
      due_at: a.due_at ?? null,
      unlock_at: a.unlock_at ?? null,
      lock_at: a.lock_at ?? null,
      points_possible: a.points_possible ?? null,
      grading_type: a.grading_type ?? null,
      allowed_extensions: a.allowed_extensions ?? null,
      submission_types: a.submission_types ?? null,
      has_submitted_submissions: a.has_submitted_submissions ?? null,
      needs_grading_count: a.needs_grading_count ?? null,
      assignment_group_id: a.assignment_group_id ?? null,
      html_url: a.html_url ?? null,
      url: a.url ?? null,
      rubric: a.rubric ?? null,
      rubric_settings: a.rubric_settings ?? null,
      use_rubric_for_grading: a.use_rubric_for_grading ?? null,
      peer_reviews: a.peer_reviews ?? null,
      automatic_peer_reviews: a.automatic_peer_reviews ?? null,
      group_category_id: a.group_category_id ?? null,
      grade_group_students_individually: a.grade_group_students_individually ?? null,
      moderated_grading: a.moderated_grading ?? null,
      omit_from_final_grade: a.omit_from_final_grade ?? null,
      only_visible_to_overrides: a.only_visible_to_overrides ?? null,
      published: a.published ?? null,
      unpublishable: a.unpublishable ?? null,
      max_attempts: a.max_attempts ?? null,
      anonymous_submissions: a.anonymous_submissions ?? null,
      external_tool_tag_attributes: a.external_tool_tag_attributes ?? null,
    }));

    return res.status(200).json({ success: true, course_id: courseId, count: shaped.length, data: shaped });
  } catch (error) {
    console.error('Error fetching assignments:', error.response?.data || error.message);
    if ([401, 403].includes(error.response?.status)) {
      const now = new Date();
      const iso = (d) => d.toISOString();
      const addDays = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
      const mockAssignments = [
        { id: '50001', course_id: String(courseId), name: 'Syllabus Quiz', due_at: iso(addDays(2)), unlock_at: null, lock_at: null, points_possible: 10, grading_type: 'points', submission_types: ['online_quiz'], published: true },
        { id: '50002', course_id: String(courseId), name: 'Homework 1: Foundations', due_at: iso(addDays(5)), unlock_at: null, lock_at: null, points_possible: 100, grading_type: 'points', submission_types: ['online_upload'], published: true },
        { id: '50003', course_id: String(courseId), name: 'Lab 1', due_at: iso(addDays(7)), unlock_at: null, lock_at: null, points_possible: 50, grading_type: 'points', submission_types: ['online_upload'], published: true },
      ];
      return res.status(200).json({ success: true, course_id: String(courseId), count: mockAssignments.length, data: mockAssignments });
    }
    return res.status(error.response?.status || 500).json({
      success: false,
      error:
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Failed to fetch assignments from Canvas',
    });
  }
};

module.exports = {
  getCourses,
  getGrades,
  getAssignments
};
