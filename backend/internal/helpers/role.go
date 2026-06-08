package helpers

import "strings"

func HasRole(userRole string, allowedRoles ...string) bool {
	normalizedUserRole := strings.TrimSpace(strings.ToLower(userRole))
	if normalizedUserRole == "" {
		return false
	}

	for _, role := range allowedRoles {
		if normalizedUserRole == strings.TrimSpace(strings.ToLower(role)) {
			return true
		}
	}

	return false
}
