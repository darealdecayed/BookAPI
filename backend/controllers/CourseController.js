// controllers/CourseController.js
const axios = require('axios');
require('dotenv').config();

const CANVAS_API_KEY = process.env.CANVAS_API_KEY;
const CANVAS_BASE_URL = 'https://canvas.instructure.com/api/v1';

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

module.exports = {
  getCourses,
  getGrades
};
