package dto

type ActivityLogItem struct {
	ID          uint   `json:"id"`
	User        string `json:"user"`
	Action      string `json:"action"`
	Module      string `json:"module"`
	Description string `json:"description"`
	IPAddress   string `json:"ip_address"`
	CreatedAt   string `json:"created_at"`
}
