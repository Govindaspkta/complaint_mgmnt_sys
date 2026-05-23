from rest_framework.response import Response

from config.pagination import BasePagination
from config.views import APIResponse


def paginated_response(request, queryset, serializer_class=None, message="success", page_size=None):

    paginator = BasePagination()
    if page_size:
        paginator.page_size = page_size
    
    page = paginator.paginate_queryset(queryset, request)
    if serializer_class:
        if page is not None:
            serializer = serializer_class(page, many=True, context ={"request":request})
            return APIResponse.success(
                data=paginator.get_paginated_response(serializer.data).data,
                message=message
            )
        serializer = serializer_class(queryset, many=True, context={"request":request})
        return APIResponse.success(data=serializer.data, message=message)
    if page is not None:
        return APIResponse.success(data=paginator.get_paginated_response(page).data,message=message)
    
    return APIResponse.success(data=[],message=message)