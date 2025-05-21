import sys
import unittest
from unittest.mock import patch, MagicMock
# Import the specific function and the client variable to manage its state
from novel_generator import choose_author, SUPPORTED_AUTHORS, get_story_theme, install_and_import_openai
import novel_generator # Import the module itself to access its global 'client'

class TestChooseAuthor(unittest.TestCase):

    @patch('builtins.print')  # Mock print to suppress output during tests
    @patch('builtins.input')
    def test_choose_author_valid_input(self, mock_input, mock_print):
        """Test with a valid numeric input."""
        mock_input.return_value = '1'
        expected_author = SUPPORTED_AUTHORS[1]
        actual_author = choose_author()
        self.assertEqual(actual_author, expected_author)
        mock_print.assert_any_call("\n请选择一位作家的风格来生成小说：") # Check if prompts are printed
        mock_input.assert_called_once_with("请输入选项数字：")

    @patch('builtins.print')
    @patch('builtins.input')
    def test_choose_author_invalid_numeric_then_valid(self, mock_input, mock_print):
        """Test with an invalid numeric input, followed by a valid one."""
        # Simulate user entering '99' (invalid), then '2' (valid)
        mock_input.side_effect = ['99', '2']
        expected_author = SUPPORTED_AUTHORS[2]
        actual_author = choose_author()
        self.assertEqual(actual_author, expected_author)
        self.assertEqual(mock_input.call_count, 2)
        mock_print.assert_any_call("无效的选项，请输入列表中的数字。")

    @patch('builtins.print')
    @patch('builtins.input')
    def test_choose_author_non_numeric_then_valid(self, mock_input, mock_print):
        """Test with a non-numeric input, followed by a valid one."""
        # Simulate user entering 'abc' (non-numeric), then '3' (valid)
        mock_input.side_effect = ['abc', '3']
        expected_author = SUPPORTED_AUTHORS[3]
        actual_author = choose_author()
        self.assertEqual(actual_author, expected_author)
        self.assertEqual(mock_input.call_count, 2)
        mock_print.assert_any_call("请输入一个有效的数字。")

    @patch('builtins.print')
    @patch('builtins.input')
    def test_choose_author_displays_options(self, mock_input, mock_print):
        """Test if the function displays the author options correctly."""
        mock_input.return_value = '1' # Any valid input to proceed
        choose_author()
        mock_print.assert_any_call("\n请选择一位作家的风格来生成小说：")
        for key, name in SUPPORTED_AUTHORS.items():
            mock_print.assert_any_call(f"{key}. {name}")

if __name__ == '__main__':
    unittest.main()

class TestGetStoryTheme(unittest.TestCase):

    @patch('builtins.print')  # Mock print to suppress output
    @patch('builtins.input')
    def test_get_story_theme_valid_input(self, mock_input, mock_print):
        """Test with a direct valid theme input."""
        expected_theme = "A heroic adventure"
        mock_input.return_value = expected_theme
        actual_theme = get_story_theme()
        self.assertEqual(actual_theme, expected_theme)
        mock_print.assert_any_call("\n请输入您希望生成的小说的主题或梗概：")
        mock_input.assert_called_once_with("> ")

    @patch('builtins.print')
    @patch('builtins.input')
    def test_get_story_theme_empty_then_valid_input(self, mock_input, mock_print):
        """Test with an initial empty input, followed by a valid one."""
        valid_theme = "A valid theme"
        # Simulate user entering "" (empty), then "   " (whitespace), then the valid theme
        mock_input.side_effect = ["", "   ", valid_theme]
        actual_theme = get_story_theme()
        self.assertEqual(actual_theme, valid_theme)
        self.assertEqual(mock_input.call_count, 3)
        mock_print.assert_any_call("主题不能为空，请重新输入：")
        # Check that the "empty theme" prompt was called twice
        calls_to_empty_prompt = [
            call for call in mock_print.call_args_list if call[0][0] == "主题不能为空，请重新输入："
        ]
        self.assertEqual(len(calls_to_empty_prompt), 2)

class TestInstallAndImportOpenAI(unittest.TestCase):
    def setUp(self):
        """Reset novel_generator.client to None before each test."""
        novel_generator.client = None
        # Store original sys.modules and restore it in tearDown
        self._original_sys_modules = sys.modules.copy()

    def tearDown(self):
        """Ensure novel_generator.client is reset after each test
           and restore original sys.modules."""
        novel_generator.client = None
        sys.modules = self._original_sys_modules

    @patch('builtins.print')
    # We will mock 'openai.OpenAI' by controlling the 'openai' module in sys.modules
    def test_openai_already_installed(self, mock_print):
        """Case 1: openai is already installed and importable."""
        mock_openai_client_instance = MagicMock()
        MockOpenAIClass = MagicMock(return_value=mock_openai_client_instance)

        # Simulate 'openai' module being available
        mock_openai_module = MagicMock()
        mock_openai_module.OpenAI = MockOpenAIClass # This is what `from openai import OpenAI` will find
        
        with patch.dict(sys.modules, {'openai': mock_openai_module}):
            result = install_and_import_openai()

        self.assertTrue(result)
        self.assertIsNotNone(novel_generator.client)
        self.assertEqual(novel_generator.client, mock_openai_client_instance)
        mock_print.assert_any_call("OpenAI library is already installed.")
        MockOpenAIClass.assert_called_once_with(
            api_key="097c49ac994437f0b9c29c539d2ab1e7695fbdc4",
            base_url="https://api-w1uda5y12f7e9a12.aistudio-app.com/v1"
        )
        # Ensure subprocess.check_call was not called by not mocking it / checking calls

    @patch('builtins.print')
    @patch('subprocess.check_call')
    def test_openai_installation_succeeds(self, mock_check_call, mock_print):
        """Case 2: openai is not initially importable, then successfully "installed" and imported."""
        mock_openai_client_instance = MagicMock()
        MockOpenAIClass = MagicMock(return_value=mock_openai_client_instance)
        
        # This mock module will be "imported" after successful installation
        mock_installed_openai_module = MagicMock()
        mock_installed_openai_module.OpenAI = MockOpenAIClass

        original_import = __builtins__['__import__']
        import_attempts = 0

        def mock_import_for_install_success(name, globals=None, locals=None, fromlist=(), level=0):
            nonlocal import_attempts
            if name == 'openai':
                import_attempts += 1
                if import_attempts == 1: # First attempt inside install_and_import_openai
                    if 'openai' in sys.modules: del sys.modules['openai'] # Ensure it's not found
                    raise ImportError("No module named openai")
                elif import_attempts == 2: # Second attempt, after "installation"
                    # Make the module available for import
                    sys.modules['openai'] = mock_installed_openai_module
                    return mock_installed_openai_module
            return original_import(name, globals, locals, fromlist, level)

        # Ensure 'openai' is not in sys.modules at the very start of the test logic
        if 'openai' in sys.modules:
            del sys.modules['openai']

        with patch('builtins.__import__', side_effect=mock_import_for_install_success):
            result = install_and_import_openai()

        self.assertTrue(result)
        self.assertIsNotNone(novel_generator.client)
        self.assertEqual(novel_generator.client, mock_openai_client_instance)
        mock_print.assert_any_call("OpenAI library not found. Attempting to install...")
        mock_check_call.assert_called_once_with(["python3.11", "-m", "pip", "install", "openai"])
        mock_print.assert_any_call("OpenAI library installed successfully.")
        MockOpenAIClass.assert_called_once_with(
            api_key="097c49ac994437f0b9c29c539d2ab1e7695fbdc4",
            base_url="https://api-w1uda5y12f7e9a12.aistudio-app.com/v1"
        )

    @patch('builtins.print')
    @patch('subprocess.check_call')
    def test_openai_installation_fails(self, mock_check_call, mock_print):
        """Case 3: openai installation fails."""
        original_import = __builtins__['__import__']
        import_attempts_failure = 0

        def mock_import_for_install_failure(name, globals=None, locals=None, fromlist=(), level=0):
            nonlocal import_attempts_failure
            if name == 'openai':
                import_attempts_failure += 1
                # Both first try (in the try-except) and second try (after failed install) should fail
                if 'openai' in sys.modules: del sys.modules['openai'] # Ensure it's not found
                raise ImportError("No module named openai")
            return original_import(name, globals, locals, fromlist, level)

        mock_check_call.side_effect = Exception("pip install failed")
        
        # Ensure 'openai' is not in sys.modules at the very start
        if 'openai' in sys.modules:
            del sys.modules['openai']

        with patch('builtins.__import__', side_effect=mock_import_for_install_failure):
            result = install_and_import_openai()

        self.assertFalse(result)
        self.assertIsNone(novel_generator.client)
        mock_print.assert_any_call("OpenAI library not found. Attempting to install...")
        mock_check_call.assert_called_once_with(["python3.11", "-m", "pip", "install", "openai"])
        mock_print.assert_any_call("Error installing OpenAI library: pip install failed")
