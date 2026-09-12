from django.contrib import admin
from .models import SearchHistory

@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'ticker', 'searched_at', 'has_prediction_data')
    list_filter = ('searched_at', 'ticker')
    search_fields = ('user__username', 'user__email', 'ticker')
    readonly_fields = ('searched_at',)
    date_hierarchy = 'searched_at'
    
    def has_prediction_data(self, obj):
        return bool(obj.prediction_data)
    has_prediction_data.boolean = True
    has_prediction_data.short_description = 'Has Snapshot'
