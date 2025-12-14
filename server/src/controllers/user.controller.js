export function getCurrentUser(req, res) {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      ok: true,
      user:
        process.env.NODE_ENV === 'development'
          ? user
          : {
              id: user._id,
              username: user.username,
            },
    });
  } catch (error) {
    console.error('Error in getCurrentUser():', error);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
