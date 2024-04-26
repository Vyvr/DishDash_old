package analytics_service

func GetYearMap() map[int]int {
	yearMap := make(map[int]int)
	for month := 1; month <= 12; month++ {
		yearMap[month] = 0
	}
	return yearMap
}
