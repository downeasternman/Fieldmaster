# Generated by Django 5.2 on 2025-05-06 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0005_settings_remove_billlineitem_amount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='billlineitem',
            name='employee_number',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
