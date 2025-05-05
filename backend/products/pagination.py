from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 50  # Number of products per page
    page_size_query_param = "page_size"  # Allow clients to set the page size (optional)
    max_page_size = 100  # Maximum page size allowed

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "current_page": self.page.number,
                "results": data,
            }
        )
