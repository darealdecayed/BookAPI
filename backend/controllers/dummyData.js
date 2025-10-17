// Dummy assignment data for Geometry - Minks (Canvas API schema)
// See: https://canvas.colorado.edu/doc/api/assignments.html


const geometryAssignments = [
  {
    id: '13127000000010001',
    name: 'Unit 1: Points, Lines, and Planes',
    description: `<p>Complete the worksheet on points, lines, and planes. Upload your answers as a PDF.</p>
<h3>Worksheet</h3>
<ol>
  <li>Define a point, a line, and a plane in your own words.</li>
  <li>Draw and label a diagram showing two lines intersecting at a point.</li>
  <li>Given points A, B, and C are collinear, and D is not on the same line, sketch the situation and name a plane containing A, B, and D.</li>
  <li>Explain the difference between a line segment and a ray. Give an example of each using points E, F, and G.</li>
  <li>Identify all points, lines, and planes in the following diagram: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Plane_geometry.svg/320px-Plane_geometry.svg.png" alt="Plane Geometry Diagram" width="200"/></li>
</ol>
<p>Be sure to show all your work and upload a clear, legible PDF.</p>`,
    created_at: '2025-08-25T14:00:00Z',
    updated_at: '2025-08-28T09:30:00Z',
    due_at: '2025-09-01T23:59:00Z',
    lock_at: '2025-09-02T23:59:00Z',
    unlock_at: '2025-08-25T14:00:00Z',
    has_overrides: false,
    course_id: '131270000000002100',
    html_url: 'https://canvas.colorado.edu/courses/131270000000002100/assignments/13127000000010001',
    url: null,
    published: true,
    points_possible: 20,
    grading_type: 'points',
    submission_types: ['online_upload'],
    allowed_extensions: ['pdf'],
    group_category_id: null,
    grade_group_students_individually: false,
    external_tool_tag_attributes: null,
    peer_reviews: false,
    automatic_peer_reviews: false,
    position: 1,
    assignment_group_id: '100',
    anonymous_submissions: false,
    discussion_topic: null,
    freeze_on_copy: false,
    rubric: [
      { id: 'r1', points: 10, description: 'Accuracy', long_description: 'Correct answers and logical reasoning.' },
      { id: 'r2', points: 10, description: 'Neatness', long_description: 'Work is organized and legible.' }
    ],
    rubric_settings: { points_possible: 20, free_form_criterion_comments: true },
    use_rubric_for_grading: true,
    needs_grading_count: 2,
    has_submitted_submissions: true,
    unpublishable: true,
    only_visible_to_overrides: false,
    locked_for_user: false,
    submissions_download_url: null,
    post_to_sis: false,
    moderated_grading: false,
    omit_from_final_grade: false,
    in_closed_grading_period: false,
    anonymous_grading: false,
    max_attempts: 1,
    turnitin_enabled: false,
    vericite_enabled: false,
    allowed_attempts: 1,
    post_manually: false,
    graded_submissions_exist: true,
    assignment_visibility: null,
    lock_info: null,
    lock_explanation: null,
    quiz_id: null
  },
  {
    id: '13127000000010002',
    name: 'Quiz: Basic Geometric Terms',
    AiAllowed: 'false',
    description: `<p>Take the online quiz covering basic geometric terms and definitions. You have 30 minutes to complete it once started.</p>
<h3>Quiz Content</h3>
<ul>
  <li>Multiple choice: Which of the following is a correct definition of a ray?</li>
  <li>Short answer: Name three undefined terms in geometry and briefly describe each.</li>
  <li>Matching: Match the following terms to their definitions: point, line, plane, segment, ray.</li>
  <li>Diagram labeling: Label the parts of a given geometric figure (diagram provided in quiz).</li>
</ul>
<p>Quiz will auto-submit after 30 minutes.</p>`,
    created_at: '2025-08-27T10:00:00Z',
    updated_at: '2025-08-29T08:00:00Z',
    due_at: '2025-09-03T23:59:00Z',
    lock_at: '2025-09-04T23:59:00Z',
    unlock_at: '2025-08-27T10:00:00Z',
    has_overrides: false,
    course_id: '131270000000002100',
    html_url: 'https://canvas.colorado.edu/courses/131270000000002100/assignments/13127000000010002',
    url: null,
    published: true,
    points_possible: 15,
    grading_type: 'points',
    submission_types: ['online_quiz'],
    allowed_extensions: null,
    group_category_id: null,
    grade_group_students_individually: false,
    external_tool_tag_attributes: null,
    peer_reviews: false,
    automatic_peer_reviews: false,
    position: 2,
    assignment_group_id: '100',
    anonymous_submissions: false,
    discussion_topic: null,
    freeze_on_copy: false,
    rubric: null,
    rubric_settings: null,
    use_rubric_for_grading: false,
    needs_grading_count: 0,
    has_submitted_submissions: false,
    unpublishable: true,
    only_visible_to_overrides: false,
    locked_for_user: false,
    submissions_download_url: null,
    post_to_sis: false,
    moderated_grading: false,
    omit_from_final_grade: false,
    in_closed_grading_period: false,
    anonymous_grading: false,
    max_attempts: 1,
    turnitin_enabled: false,
    vericite_enabled: false,
    allowed_attempts: 1,
    post_manually: false,
    graded_submissions_exist: false,
    assignment_visibility: null,
    lock_info: null,
    lock_explanation: null,
    quiz_id: null
  }
];

module.exports = { geometryAssignments };
