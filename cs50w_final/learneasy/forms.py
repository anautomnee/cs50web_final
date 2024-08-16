from django import forms

class TextForm(forms.Form):
    text_name = forms.CharField(label="Text name", max_length=64,widget=forms.TextInput(attrs={'class': 'text_name_field', 'placeholder': 'E.g My new text'}))
    text_content = forms.CharField(widget=forms.Textarea(attrs={'class': 'form_textarea'}))