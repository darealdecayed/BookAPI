// controllers/CourseController.js
const axios = require('axios');
const path = require('node:path');
// Ensure env is loaded if not already (works when importing controller directly)
if (!process.env.CANVAS_API_KEY) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const CANVAS_API_KEY = (process.env.CANVAS_API_KEY || '').trim();
const CANVAS_BASE_URL = 'https://canvas.instructure.com/api/v1';


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
      id: a.id,
      course_id: a.course_id,
      name: a.name,
      due_at: a.due_at,
      unlock_at: a.unlock_at,
      lock_at: a.lock_at,
      points_possible: a.points_possible,
      grading_type: a.grading_type,
      submission_types: a.submission_types,
      published: a.published,
    }));

    return res.status(200).json({ success: true, course_id: courseId, count: shaped.length, data: shaped });
  } catch (error) {
    console.error('Error fetching assignments:', error.response?.data || error.message);
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
